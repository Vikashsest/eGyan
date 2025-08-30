import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { User, UserRole } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { StudentActivity } from './entities/student-activity.entity';
import { StudentStatsHelper } from '../../common/utils/Helper/studentStats';
import { Concern } from './entities/raise-concern.entity';
import { CreateConcernDto } from './dto/raise-concern.dto';
import { BookProgress } from '../book/entities/book-progress.entity';
import { ResourceType, ActivityType } from './entities/student-activity.entity';
import { LogActivityDto } from './dto/log.acitvity.dto';
import { Announcement } from './entities/announcement.entity';
import { Chapter } from '../book/entities/chapter.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,

    @InjectRepository(StudentActivity)
    private readonly studentActivityRepo: Repository<StudentActivity>,
    @InjectRepository(Concern)
    private readonly concernRepo: Repository<Concern>,
    @InjectRepository(BookProgress)
    private readonly bookprogress: Repository<BookProgress>,
    @InjectRepository(Chapter)
    private readonly chapterRepo: Repository<Chapter>,
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>

  ) { }

  async studentMetrice(userId: number) {
    const [totalTimeSpent, booksCompleted, recentActivityCount, favoriteBooksCount] = await Promise.all([
      StudentStatsHelper.getTotalTimeSpent(this.studentActivityRepo, userId),
      StudentStatsHelper.getBooksCompleted(this.studentActivityRepo, userId),
      StudentStatsHelper.getRecentActivityCount(this.studentActivityRepo, userId),
      StudentStatsHelper.getFavoriteBooksCount(this.studentActivityRepo, userId),
    ]);

    return {
      totalTimeSpent,
      booksCompleted,
      recentActivityCount,
      favoriteBooksCount,
    };

  }

  async markBookAsCompleted(userId: number, bookId: number) {
    const existingActivity = await this.studentActivityRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });

    if (existingActivity) {
      existingActivity.isCompleted = true;
      existingActivity.updatedAt = new Date();
      return this.studentActivityRepo.save(existingActivity);
    } else {
      const newActivity = this.studentActivityRepo.create({
        user: { id: userId },
        book: { id: bookId },
        isCompleted: true,
        timeSpent: 0,
      });
      return this.studentActivityRepo.save(newActivity);
    }
  }

  async raiseConcern(userId: number, dto: CreateConcernDto) {

    const user = await this.userRepo.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException("User not found")
    }
    const concern = this.concernRepo.create({ ...dto, student: user })
    return await this.concernRepo.save(concern)
  }

  async previousConcern(userId: number) {
    return this.concernRepo
      .createQueryBuilder('concern')
      .leftJoinAndSelect('concern.student', 'student')
      .where('student.id = :userId', { userId })
      .orderBy(`
      CASE 
        WHEN concern.status = 'resolved' THEN 0
        WHEN concern.status = 'pending' THEN 1
        WHEN concern.status = 'rejected' THEN 2
        ELSE 3
      END
    `)
      .addOrderBy('concern.id', 'DESC')
      .getMany();
  }

  async remove(id: number) {
    return await this.bookRepo.delete(id);
  }
  async getByFilters(query: Partial<Book>): Promise<Book[]> {
    return this.bookRepo.find({
      where: query,
      order: { uploadedAt: 'DESC' },
    });
  }
  // async getStudentProgress(userId: number) {
  //   const activities = await this.studentActivityRepo.find({ 
  //     where: { user: { id: userId } },
  //     relations: ['book'],
  //   });

  //   const booksInProgress = activities.filter(
  //     (a) => a.activityType === ActivityType.OPENED && !a.isCompleted,
  //   ).length;

  //   const avgSessionRaw = activities.length
  //     ? Math.round(activities.reduce((sum, act) => sum + act.timeSpent, 0) / activities.length)
  //     : 0;
  //  function formatTime(seconds: number): string {
  //     const h = Math.floor(seconds / 3600);
  //     const m = Math.floor((seconds % 3600) / 60);
  //     return `${h}h ${m}m`;
  //   }
  //   const avgSessionTime = formatTime(avgSessionRaw); // human-readable

  //   const lastActivity = activities.sort(
  //     (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  //   )[0];

  //   const recentActivity = activities
  //     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  //     .slice(0, 5)
  //     .map((a) => ({
  //       type: a.resourceType,
  //       title: a.resourceTitle,
  //       time: a.createdAt,
  //     }));

  //   const subjectWiseProgress = {} as Record<string, { completed: number; total: number }>;

  //   activities.forEach((act) => {
  //     const subject = act.book?.subject || 'General';
  //     if (!subjectWiseProgress[subject]) {
  //       subjectWiseProgress[subject] = { completed: 0, total: 0 };
  //     }
  //     subjectWiseProgress[subject].total += 1;
  //     if (act.isCompleted) subjectWiseProgress[subject].completed += 1;
  //   });

  //   return {
  //     booksInProgress,
  //     avgSessionTime,           // "02:46" instead of 2767
  //     lastActivity: lastActivity?.updatedAt,
  //     recentActivity,
  //     subjectWiseProgress,
  //   };
  // }

  // async getStudentProgress(userId: number) {
  //   const activities = await this.studentActivityRepo.find({
  //     where: { user: { id: userId } },
  //     relations: ['book'],
  //   });
  //  const booksInProgress = activities.filter((a) => {
  //   const totalPages = a.book?.totalPages ?? 0;
  //   const pagesRead = a.pageNumber ?? 0;
  //   return totalPages > 0 && pagesRead > 0 && pagesRead < totalPages;
  // }).length;

  //   const avgSessionSeconds = activities.length
  //     ? Math.round(activities.reduce((sum, act) => sum + act.timeSpent, 0) / activities.length)
  //     : 0;
  //   const avgSessionTime = this.formatTime(avgSessionSeconds);
  //   const latestActivity = activities.reduce((latest: StudentActivity | null, current) => {
  //     if (!latest || current.updatedAt > latest.updatedAt) {
  //       return current;
  //     }
  //     return latest;
  //   }, null);
  // const recentActivity = activities
  //   .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()) 
  //   .slice(0, 5)
  //   .map((a) => ({
  //     type: a.resourceType,
  //     title: a.resourceTitle,
  //     time: a.updatedAt,
  //   }));

  //  const subjectWiseProgress = {} as Record<string, { completed: number; total: number; progressSum: number }>;

  // activities.forEach((act) => {
  //   const subject = act.book?.subject?.trim() || 'General';
  //   if (!subjectWiseProgress[subject]) {
  //     subjectWiseProgress[subject] = { completed: 0, total: 0, progressSum: 0 };
  //   }
  //   subjectWiseProgress[subject].total += 1;

  //   let progressPercent = 0;
  //   if (act.pageNumber && act.book.totalPages) {
  //     progressPercent = (act.pageNumber / act.book.totalPages) * 100;
  //   } else if (act.isCompleted) {
  //     progressPercent = 100;
  //   }
  //   subjectWiseProgress[subject].progressSum += progressPercent;

  //   if (act.isCompleted) {
  //     subjectWiseProgress[subject].completed += 1;
  //   }
  // });

  // const finalSubjectProgress = {};
  // for (const subject in subjectWiseProgress) {
  //   const data = subjectWiseProgress[subject];
  //   const avgProgress = data.progressSum / data.total;
  //   finalSubjectProgress[subject] = {
  //     completed: data.completed,
  //     total: data.total,
  //     percentage: Math.round(avgProgress),
  //   };
  // }

  // return {
  //   booksInProgress,
  //   avgSessionTime,
  //  lastActivity: latestActivity?.updatedAt,
  //   recentActivity,
  //   subjectWiseProgress: finalSubjectProgress,
  // };

  // }

  // async getStudentProgress(userId: number) {
  //   const activities = await this.studentActivityRepo.find({
  //     where: { user: { id: userId } },
  //     relations: ['book'],
  //   });

  //   const booksInProgress = activities.filter((a) => {
  //     const totalPages = a.book?.totalPages ?? 0;
  //     const pagesRead = a.pageNumber ?? 0;
  //     return totalPages > 0 && pagesRead > 0 && pagesRead < totalPages && !a.isCompleted;
  //   }).length;

  //   const avgSessionSeconds = activities.length
  //     ? Math.round(
  //         activities.reduce((sum, act) => sum + act.timeSpent, 0) / activities.length
  //       )
  //     : 0;
  //   const avgSessionTime = this.formatTime(avgSessionSeconds);

  //   const latestActivity = activities.reduce(
  //     (latest: StudentActivity | null, current) =>
  //       !latest || current.updatedAt > latest.updatedAt ? current : latest,
  //     null
  //   );

  //   const recentActivity = activities
  //     .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  //     .slice(0, 5)
  //     .map((a) => ({
  //       type: a.resourceType,
  //       title: a.resourceTitle,
  //       time: a.updatedAt,
  //     }));

  //   const subjectWiseProgress = {} as Record<
  //     string,
  //     { completed: number; total: number; progressSum: number }
  //   >;

  //   activities.forEach((act) => {
  //       console.log('Book:', act.book.bookName, 'TotalPages:', act.book.totalPages, 'PageNumber:', act.pageNumber);
  //     const subject = act.book?.subject?.trim() || 'General';
  //     if (!subjectWiseProgress[subject]) {
  //       subjectWiseProgress[subject] = { completed: 0, total: 0, progressSum: 0 };
  //     }
  //     subjectWiseProgress[subject].total += 1;

  //     let progressPercent = 0;
  //     if (
  //       act.pageNumber !== undefined &&
  //       act.pageNumber > 0 &&
  //       act.book.totalPages
  //     ) {
  //       // Calculate accurate progress %
  //       progressPercent = Math.min(
  //         100,
  //         (act.pageNumber / act.book.totalPages) * 100
  //       );
  //     } else if (act.isCompleted) {
  //       progressPercent = 100;
  //     }
  //     subjectWiseProgress[subject].progressSum += progressPercent;

  //     if (act.isCompleted) {
  //       subjectWiseProgress[subject].completed += 1;
  //     }
  //   });

  //   const finalSubjectProgress = {};
  //   for (const subject in subjectWiseProgress) {
  //     const data = subjectWiseProgress[subject];
  //     const avgProgress = data.progressSum / data.total;
  //     finalSubjectProgress[subject] = {
  //       completed: data.completed,
  //       total: data.total,
  //       percentage: Math.round(avgProgress),
  //     };
  //   }

  //   return {
  //     booksInProgress,
  //     avgSessionTime,
  //     lastActivity: latestActivity?.updatedAt,
  //     recentActivity,
  //     subjectWiseProgress: finalSubjectProgress,
  //   };
  // }
async getStudentProgress(userId: number) {
    const activities = await this.studentActivityRepo.find({
      where: { user: { id: userId } },
      relations: ['book', 'chapter'],
    });
    const booksInProgress = activities.filter((a) => {
      const totalPages = a.chapter?.totalPages ?? a.book?.totalPages ?? 0;
      const pagesRead = a.pageNumber ?? 0;
      return totalPages > 0 && pagesRead > 0 && pagesRead < totalPages && !a.isCompleted;
    }).length;
    const avgSessionSeconds = activities.length
      ? Math.round(activities.reduce((sum, a) => sum + a.timeSpent, 0) / activities.length)
      : 0;
    const avgSessionTime = this.formatTime(avgSessionSeconds);
    const latestActivity = activities.reduce((latest: any, current) =>
      !latest || current.updatedAt > latest.updatedAt ? current : latest,
      null
    );

    const recentActivity = activities
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map((a) => ({
        type: a.resourceType,
        title: a.chapter?.chapterName || a.book?.bookName || 'Unknown',
        time: a.updatedAt,
      }));
    const subjectWiseProgress: Record<string, { completed: number; total: number; progressSum: number }> = {};
    activities.forEach((act) => {
      const book = act.book;
      if (!book) return;

      const subject = book.subject?.trim() || 'General';
      if (!subjectWiseProgress[subject]) {
        subjectWiseProgress[subject] = { completed: 0, total: 0, progressSum: 0 };
      }
      subjectWiseProgress[subject].total += 1;
      const totalPages = act.chapter?.totalPages ?? book.totalPages ?? 0;
      const pagesRead = act.pageNumber ?? 0;

      let progressPercent = 0;
      if (totalPages > 0) {
        progressPercent = Math.min(100, (pagesRead / totalPages) * 100);
      } else if (act.isCompleted) {
        progressPercent = 100;
      }

      subjectWiseProgress[subject].progressSum += progressPercent;

      if (act.isCompleted) {
        subjectWiseProgress[subject].completed += 1;
      }
    });
    const finalSubjectProgress: Record<string, { completed: number; total: number; percentage: number }> = {};
    for (const subject in subjectWiseProgress) {
      const data = subjectWiseProgress[subject];
      const avgProgress = data.progressSum / data.total;
      finalSubjectProgress[subject] = {
        completed: data.completed,
        total: data.total,
        percentage: Math.round(avgProgress),
      };
    }

    return {
      booksInProgress,
      avgSessionTime,
      lastActivity: latestActivity?.updatedAt,
      recentActivity,
      subjectWiseProgress: finalSubjectProgress,
    };
  }





  // async getStudentProgress(userId: number) {
  //   const activities = await this.studentActivityRepo.find({
  //     where: { user: { id: userId } },
  //     relations: ['book', 'chapter'], 
  //   });

  //   const booksInProgress = activities.filter((a) => {
  //     const totalPages = a.chapter?.totalPages ?? a.book?.totalPages ?? 0;
  //     const pagesRead = a.pageNumber ?? 0;
  //     return totalPages > 0 && pagesRead > 0 && pagesRead < totalPages && !a.isCompleted;
  //   }).length;

  //   const avgSessionSeconds = activities.length
  //     ? Math.round(
  //         activities.reduce((sum, act) => sum + act.timeSpent, 0) / activities.length
  //       )
  //     : 0;
  //   const avgSessionTime = this.formatTime(avgSessionSeconds);
  //   const latestActivity = activities.reduce(
  //     (latest: StudentActivity | null, current) =>
  //       !latest || current.updatedAt > latest.updatedAt ? current : latest,
  //     null
  //   );
  //   const recentActivity = activities
  //     .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  //     .slice(0, 5)
  //     .map((a) => ({
  //       type: a.resourceType,
  //       title: a.chapter?.chapterName || a.book?.bookName || 'Unknown',
  //       time: a.updatedAt,
  //     }));
  //   const subjectWiseProgress = {} as Record<
  //     string,
  //     { completed: number; total: number; progressSum: number }
  //   >;

  //   activities.forEach((act) => {
  //     const book = act.book;
  //     if (!book) return;

  //     const subject = book.subject?.trim() || 'General';
  //     if (!subjectWiseProgress[subject]) {
  //       subjectWiseProgress[subject] = { completed: 0, total: 0, progressSum: 0 };
  //     }

  //     subjectWiseProgress[subject].total += 1;
  //     const totalPages = act.chapter?.totalPages ?? book.totalPages ?? 0;
  //     let progressPercent = 0;

  //     if (totalPages > 0 && act.pageNumber) {
  //       progressPercent = Math.min(100, (act.pageNumber / totalPages) * 100);
  //     } else if (act.isCompleted) {
  //       progressPercent = 100;
  //     }

  //     subjectWiseProgress[subject].progressSum += progressPercent;

  //     if (act.isCompleted) {
  //       subjectWiseProgress[subject].completed += 1;
  //     }
  //   });

  //   // Final subject progress percentage
  //   const finalSubjectProgress = {};
  //   for (const subject in subjectWiseProgress) {
  //     const data = subjectWiseProgress[subject];
  //     const avgProgress = data.progressSum / data.total;
  //     finalSubjectProgress[subject] = {
  //       completed: data.completed,
  //       total: data.total,
  //       percentage: Math.round(avgProgress),
  //     };
  //   }

  //   return {
  //     booksInProgress,
  //     avgSessionTime,
  //     lastActivity: latestActivity?.updatedAt,
  //     recentActivity,
  //     subjectWiseProgress: finalSubjectProgress,
  //   };
  // }



  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }

  async getRecentBooks(userId: number) {
    const activities = await this.studentActivityRepo.find({
      where: { user: { id: userId } },
      relations: ['book'],
      loadEagerRelations: true
    });

    const recentBookActivities = activities
      .filter((a) => a.book)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return recentBookActivities.map((a) => ({
      id: a.book?.id,
      bookName: a.resourceTitle,
      subject: a.book?.subject,
      type: a.resourceType,
      lastAccessed: a.createdAt,

    }));
  }


  async getFavoriteBooksList(userId: number) {
    const favoriteActivities = await this.studentActivityRepo.find({
      where: {
        user: { id: userId },
        isFavorite: true,
      },
      relations: ['book','chapter'],
    });

    return favoriteActivities.map((act) => ({
      id: act.book.id,
      title: act.book.bookName,
      subject: act.book.subject,
      type: act.resourceType,
    }));
  }


  async getFavoriteBooks(userId: number) {
    return this.studentActivityRepo
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.book', 'book')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.isFavorite = true')
      .select([
        'book.id',
        'book.bookName',
        'book.thumbnail',
        'book.subject',
        'book.language',
      ])
      .getMany();
  }
async toggleFavoriteStatus(userId: number, bookId: number) {
    const activityRepo = this.studentActivityRepo;

    const existing = await activityRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
      relations: ['book', 'user','chapter'],
    });

    if (existing) {
      existing.isFavorite = !existing.isFavorite;
      return await activityRepo.save(existing);
    } else {
      // const book = await this.bookRepo.findOne({ where: { id: bookId } });
      
      // if (!book || !chapter.resourceType) {
      //   throw new NotFoundException('Book not found or missing resourceType');
      // }

      // const resourceType = book.resourceType.toUpperCase();
      // if (!Object.values(ResourceType).includes(resourceType as ResourceType)) {
      //   throw new BadRequestException(`Invalid resourceType: ${resourceType}`);
      // }

      // const newActivity = this.studentActivityRepo.create({
      //   user: { id: userId },
      //   book: { id: bookId },
      //   activityType: ActivityType.FAVORITE,
      //   resourceTitle: book.bookName,
      //   isFavorite: true,
      //   resourceType: resourceType as ResourceType,
      // });
      // return await activityRepo.save(newActivity);
      const book = await this.bookRepo.findOne({
  where: { id: bookId },
  relations: ['chapters'],
});

if (!book || !book.chapters || book.chapters.length === 0) {
  throw new NotFoundException('Book or chapters not found');
}

// Default to first chapter
const chapter = book.chapters[0];

if (!chapter.resourceType) {
  throw new BadRequestException('Chapter missing resourceType');
}

const resourceType = chapter.resourceType.toUpperCase();
if (!Object.values(ResourceType).includes(resourceType as ResourceType)) {
  throw new BadRequestException(`Invalid resourceType: ${resourceType}`);
}

const newActivity = this.studentActivityRepo.create({
  user: { id: userId },
  book: { id: bookId },
  chapter: { id: chapter.id }, // ✅ chapter relation bhi add karo
  activityType: ActivityType.FAVORITE,
  resourceTitle: book.bookName,
  isFavorite: true,
  resourceType: resourceType as ResourceType,
});

return await activityRepo.save(newActivity);

    }
  }


  // async logActivity(userId: number, { bookId, timeSpent, isCompleted }: LogActivityDto) {
  //   const existing = await this.studentActivityRepo.findOne({
  //     where: { user: { id: userId }, book: { id: bookId } },
  //   });

  //   if (existing) {
  //     existing.timeSpent += timeSpent ?? 0;
  // existing.isCompleted = existing.isCompleted || (isCompleted ?? false);


  //     return this.studentActivityRepo.save(existing);
  //   }

  //   const book = await this.bookRepo.findOne({
  //     where: { id: bookId },
  //   });

  //   if (!book) {
  //     throw new NotFoundException(`Book with ID ${bookId} not found`);
  //   }
  //     const resourceType = book.resourceType.toUpperCase();
  // if (!Object.values(ResourceType).includes(resourceType as ResourceType)) {
  //   throw new BadRequestException(`Invalid resourceType: ${resourceType}`);
  // }


  //   const activity = this.studentActivityRepo.create({
  //     user: { id: userId },
  //     book,
  //     timeSpent,
  //     isCompleted,
  //     activityType: ActivityType.OPENED, // Or based on your logic
  //   resourceType: resourceType as ResourceType,
  //     resourceTitle: book.bookName,         // From Book entity
  //   });

  //   return this.studentActivityRepo.save(activity);
  // }


  // async logActivity(userId: number, dto: LogActivityDto) {
  //   const { bookId, timeSpent, isCompleted, activityType, pageNumber } = dto;

  //   const book = await this.bookRepo.findOne({ where: { id: bookId } });
  //   if (!book) throw new NotFoundException(`Book with ID ${bookId} not found`);

  //   let existing = await this.studentActivityRepo.findOne({
  //     where: { user: { id: userId }, book: { id: bookId } },
  //   });

  //   const estimatedReadTime = (book.totalPages ?? 0) * 30;

  //   // Always parse pageNumber as number if present
  //   const parsedPageNumber =
  //     pageNumber !== undefined && pageNumber !== null
  //       ? Number(pageNumber)
  //       : undefined;

  //   if (existing) {
  //     existing.timeSpent += timeSpent ?? 0;

  //     // ✅ Always update pageNumber if provided (even if 0)
  //     if (parsedPageNumber !== undefined && !isNaN(parsedPageNumber)) {
  //       existing.pageNumber = parsedPageNumber;
  //     }

  //     let completed = false;
  //     if (parsedPageNumber !== undefined && book.totalPages) {
  //       completed = parsedPageNumber >= book.totalPages;
  //     } else if (estimatedReadTime > 0) {
  //       completed = existing.timeSpent >= estimatedReadTime;
  //     }

  //     if (isCompleted && !existing.isCompleted) {
  //       completed = true;
  //     }

  //     if (completed) {
  //       existing.isCompleted = true;
  //       existing.activityType = ActivityType.COMPLETED;
  //     } else {
  //       existing.activityType = activityType ?? existing.activityType;
  //     }

  //     existing.updatedAt = new Date();
  //     return this.studentActivityRepo.save(existing);
  //   }

  //   // New activity creation
  //   let completed = false;
  //   if (parsedPageNumber !== undefined && book.totalPages) {
  //     completed = parsedPageNumber >= book.totalPages;
  //   } else if (estimatedReadTime > 0) {
  //     completed = (timeSpent ?? 0) >= estimatedReadTime;
  //   }
  //   if (isCompleted) {
  //     completed = true;
  //   }
  //   console.log('Incoming DTO:', dto);
  // console.log('pageNumber type:', typeof dto.pageNumber);


  //   const newActivity = this.studentActivityRepo.create({
  //     user: { id: userId } as User,
  //     book: book as Book,
  //     timeSpent: timeSpent ?? 0,
  //     isCompleted: completed,
  //     activityType: completed
  //       ? ActivityType.COMPLETED
  //       : activityType ?? ActivityType.OPENED,
  //     resourceType: dto.resourceType,
  //     resourceTitle: book.bookName,
  //     updatedAt: new Date(),
  //     pageNumber:
  //       parsedPageNumber !== undefined && !isNaN(parsedPageNumber)
  //         ? parsedPageNumber
  //         : undefined,
  //   });

  //   return this.studentActivityRepo.save(newActivity);
  // }

  
  async logActivity(userId: number, dto: LogActivityDto) {
    const {
      bookId,
      chapterId,
      timeSpent,
      isCompleted,
      activityType,
      pageNumber,
      resourceType,
    } = dto;

    const book = await this.bookRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException(`Book with ID ${bookId} not found`);

    let chapter: Chapter | undefined = undefined;
    if (chapterId) {
      chapter = (await this.chapterRepo.findOne({ where: { id: chapterId } })) || undefined;
      if (!chapter) throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }
    const parsedPageNumber =
      pageNumber !== undefined && pageNumber !== null ? Number(pageNumber) : undefined;

    let existing = await this.studentActivityRepo.findOne({
      where: chapter
        ? { user: { id: userId }, book: { id: bookId }, chapter: { id: chapter.id } }
        : { user: { id: userId }, book: { id: bookId }, chapter: undefined },
    });

    const totalPages = chapter?.totalPages ?? book.totalPages ?? 0;
    const estimatedReadTime = totalPages * 30; 
    const checkCompletion = (
      parsedPageNumber?: number,
      totalPages?: number,
      timeSpent?: number,
      isCompletedFlag?: boolean
    ) => {
      if (isCompletedFlag) return true;
      if (parsedPageNumber !== undefined && totalPages) {
        return parsedPageNumber >= totalPages;
      }
      if (estimatedReadTime > 0 && timeSpent) {
        return timeSpent >= estimatedReadTime;
      }
      return false;
    };
    if (existing) {
      existing.timeSpent += timeSpent ?? 0;
      if (parsedPageNumber !== undefined && !isNaN(parsedPageNumber)) {
        existing.pageNumber = parsedPageNumber; 
      }
      if (chapter) existing.chapter = chapter;

      existing.isCompleted = checkCompletion(
        parsedPageNumber,
        totalPages,
        existing.timeSpent,
        isCompleted
      );

      existing.activityType = existing.isCompleted
        ? ActivityType.COMPLETED
        : activityType ?? existing.activityType;

      existing.updatedAt = new Date();
      return this.studentActivityRepo.save(existing);
    }
    const completed = checkCompletion(parsedPageNumber, totalPages, timeSpent, isCompleted);
    const newActivity = this.studentActivityRepo.create({
      user: { id: userId } as User,
      book,
      chapter: chapter ?? undefined,
      timeSpent: timeSpent ?? 0,
      pageNumber: parsedPageNumber ?? undefined, 
      isCompleted: completed,
      activityType: completed ? ActivityType.COMPLETED : activityType ?? ActivityType.OPENED,
      resourceType,
      resourceTitle:
        chapter?.chapterName ?? (chapter ? `Chapter ${chapter.chapterNumber}` : book.bookName),
      updatedAt: new Date(),
    });
    return this.studentActivityRepo.save(newActivity);
  }

  async getAnnouncements(): Promise<any[]> {
    const announcements = await this.announcementRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return announcements.map((a) => ({
      id: a.id,
      message: a.message,
      createdAt: a.createdAt,
    }));
  }


async deleteConcern(id: number) {
  const concern = await this.concernRepo.findOne({ where: { id } });
  if (!concern) {
    throw new NotFoundException(`Concern with ID ${id} not found`);
  }
  await this.concernRepo.delete(id);
  return { message: 'Concern deleted successfully' };
}

}