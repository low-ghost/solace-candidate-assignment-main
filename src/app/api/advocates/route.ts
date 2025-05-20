import db from '@/db';
import { advocates } from '@/db/schema';
import { ilike, or, sql } from 'drizzle-orm';

type AdvocateWithTotal = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: unknown;
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt: Date | string | null;
  total: number;
};

const stripTotal = (
  rows: AdvocateWithTotal[],
): Omit<AdvocateWithTotal, 'total'>[] => rows.map(({ total, ...rest }) => rest);

const isPositiveInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const pageRaw = searchParams.get('page');
  const limitRaw = searchParams.get('limit');
  const page = pageRaw ? Number(pageRaw) : 1;
  const limit = limitRaw ? Number(limitRaw) : 10;

  if (!isPositiveInteger(page) || !isPositiveInteger(limit)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid page or limit. Both must be positive integers.',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const offset = (page - 1) * limit;
  const likeQuery = search ? `%${search}%` : undefined;
  const whereClause = search
    ? or(
        ilike(advocates.firstName, likeQuery!),
        ilike(advocates.lastName, likeQuery!),
        ilike(advocates.city, likeQuery!),
        ilike(advocates.degree, likeQuery!),
        sql.raw(`payload::text ILIKE '${likeQuery}'`),
      )
    : undefined;

  try {
    const data = await db
      .select({
        id: advocates.id,
        firstName: advocates.firstName,
        lastName: advocates.lastName,
        city: advocates.city,
        degree: advocates.degree,
        specialties: advocates.specialties,
        yearsOfExperience: advocates.yearsOfExperience,
        phoneNumber: advocates.phoneNumber,
        createdAt: advocates.createdAt,
        total: sql`COUNT(*) OVER()`.mapWith(Number),
      })
      .from(advocates)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const total = data.length > 0 ? data[0].total : 0;

    return Response.json({ data, total, page, limit });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
