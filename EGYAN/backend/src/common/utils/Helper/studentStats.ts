export const StudentStatsHelper = {
    async getTotalTimeSpent(studentActvity, userId: number): Promise<number> {
    const result = await studentActvity
      .createQueryBuilder('activity')
      .select('SUM(activity.timeSpent)', 'total')
      .where('activity.userId = :userId', { userId })
      .getRawOne();

    return Number(result.total) || 0;
  },

  async getBooksCompleted(studentActvity, userId: number): Promise<number> {
    const result = await studentActvity
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.isCompleted = true')
      .select('COUNT(DISTINCT activity.bookId)', 'completedCount') 
      .getRawOne();

    return Number(result.completedCount) || 0;
  },

  async getRecentActivityCount(studentActvity, userId: number): Promise<number> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await studentActvity
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.updatedAt >= :oneWeekAgo', { oneWeekAgo })
      .select('COUNT(DISTINCT activity.bookId)', 'recentCount')  
      .getRawOne();

    return Number(result.recentCount) || 0;
  },

  async getFavoriteBooksCount(studentActvity, userId: number): Promise<number> {
    const result = await studentActvity
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.isFavorite = true')
      .select('COUNT(DISTINCT activity.bookId)', 'favCount') 
      .getRawOne();

    return Number(result.favCount) || 0;
  }
};
