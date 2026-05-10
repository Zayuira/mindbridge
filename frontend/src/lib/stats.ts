import prisma from './prisma';

export async function getPlatformStats() {
  try {
    const [
      totalJobs,
      totalFreelancers,
      completedContracts,
      totalMoneyResult,
      ratingResult
    ] = await Promise.all([
      // 1. Нийт нээлттэй ажлын тоо
      prisma.job.count({ where: { status: 'OPEN' } }),
      
      // 2. Нийт хэрэглэгчид (Client + Freelancer)
      prisma.user.count(),
      
      // 3. Амжилттай дууссан төслүүд
      prisma.contract.count({ where: { status: 'COMPLETED' } }),
      
      prisma.contract.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { agreed_amount: true }
      }),

      // 5. Дундаж үнэлгээ (Satisfaction)
      prisma.review.aggregate({
        _avg: { rating: true }
      })
    ]);

    const avgRating = ratingResult._avg.rating || 5;
    const satisfaction = Math.round((avgRating / 5) * 100);

    return {
      totalJobs: totalJobs,
      totalUsers: totalFreelancers,
      totalProjects: completedContracts,
      totalFunding: totalMoneyResult._sum.agreed_amount || 0,
      satisfaction: satisfaction
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      totalJobs: 0,
      totalUsers: 0,
      totalProjects: 0,
      totalFunding: 0,
      satisfaction: 100
    };
  }
}
