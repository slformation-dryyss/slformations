import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HistoryTable from "../HistoryTable";

export default async function HistoryPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string, search?: string }>
}) {
    await requireAdmin();

    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const search = params.search || "";
    const itemsPerPage = 50;

    const whereClause: any = {};
    if (search) {
        whereClause.OR = [
            { user: { firstName: { contains: search, mode: "insensitive" } } },
            { user: { lastName: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { course: { title: { contains: search, mode: "insensitive" } } }
        ];
    }

    const [links, totalCount, users, courses] = await Promise.all([
        prisma.paymentLink.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            include: {
                user: { select: { email: true, firstName: true, lastName: true, phone: true } },
                course: { select: { title: true } }
            }
        }),
        prisma.paymentLink.count({ where: whereClause }),
        prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true }, orderBy: { lastName: 'asc' } }),
        prisma.course.findMany({ select: { id: true, title: true }, where: { isPublished: true } })
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div>
            <HistoryTable
                links={links as any}
                totalCount={totalCount}
                currentPage={page}
                totalPages={totalPages}
                users={users}
                courses={courses}
            />
        </div>
    );
}
