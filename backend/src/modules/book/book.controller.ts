import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException, UploadedFiles, Query, Req, NotFoundException, HttpException, Res, HttpStatus } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/utils/multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { User, UserRole } from '../user/entities/user.entity';
import { Response } from 'express';
const fetch = require('node-fetch');

import { Readable } from 'stream';
interface CustomRequest extends Request {
  user: User;
}

@Controller('books')
 @UseGuards(JwtAuthGuard, RolesGuard) 
export class BookController {
  constructor(private readonly bookService: BookService) {}
@Post('upload')
@Roles(UserRole.ADMIN, UserRole.TEACHER,UserRole.PRINCIPAL)
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ],
    multerConfig
  )
)
async uploadBook(
  @UploadedFiles()
  files: {
    file?: Express.Multer.File[];
    thumbnail?: Express.Multer.File[];
  },
  @Body() createBookDto: CreateBookDto,
 @Req() req: CustomRequest
) {
  console.log(req.user)
 
  const thumbnail = files.thumbnail?.[0];
  if (thumbnail) {
    createBookDto.thumbnail = thumbnail.path || `uploads/${thumbnail.filename}`;
  }
 const user = req.user!;
    return this.bookService.createBook(createBookDto, user);
}

@Get('proxy/chapters/:bookId/chapter-:chapterNumber.pdf')
async proxyChapterPdf(
  @Param('bookId') bookId: string,
  @Param('chapterNumber') chapterNumber: string,
  @Res() res: Response,
) {
  const url = `https://cloud.ptgn.in/c/remote.php/dav/files/egyan/books/${bookId}/chapters/chapter-${chapterNumber}.pdf`;

  const response = await fetch(url, {
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`,
        ).toString('base64'),
    },
  });

  if (!response.ok || !response.body) {
    throw new NotFoundException('File not found');
  }

  res.setHeader('Content-Disposition', 'inline');
  res.setHeader(
    'Content-Type',
    response.headers.get('content-type') || 'application/pdf',
  );

  (response.body as any).pipe(res);
}
@Get('proxy/chapters/:bookId/:chapterNumber.pdf')
async proxyChapterFile(
  @Param('bookId') bookId: number,
  @Param('chapterNumber') chapterNumber: number,
  @Res() res: Response,
) {
  const { stream, contentType } = await this.bookService.getChapterFileStream(
    +bookId,
    +chapterNumber,
  );

  res.setHeader('Content-Type', contentType || 'application/pdf');
  stream.pipe(res);
}


@Get()
findAll(){
 const books=this.bookService.findAll()
  return books
}
@Get('uploaded-by')
async uploadedBy(@Req() req: CustomRequest) {
  const userId = req.user?.id;
  return this.bookService.findByUploaderId(userId);
}
@Delete(':id')
@Roles(UserRole.ADMIN,UserRole.PRINCIPAL,UserRole.TEACHER)
async deleteBook(@Param('id') id: number) {
  return await this.bookService.remove(id);
}
  @Get('dashboard-stats')
  @Roles(UserRole.ADMIN,UserRole.PRINCIPAL)
   async getStats(){
    return this.bookService.getDashboardStats()
   }

@Get(':id')
@Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
async getBookById(@Param('id') id: string) {
  const book = await this.bookService.findOneById(+id);
  if (!book) {
    throw new NotFoundException('Book not found');
  }
  return book;
}
@Get('filter')
// @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL,UserRole.ADMIN)
getFilteredBooks(@Query() query: any) {
  return this.bookService.getFilteredBooks(query);
}

@Patch(':id')
@Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
@UseInterceptors(FileInterceptor('pdf'))
update(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() updateBookDto: UpdateBookDto,
) {
  return this.bookService.updateBook(+id, updateBookDto, file);
}

// @Get()
// async(){
//   return this.bookService.findAll()
// }
@Post(':bookId/chapters')
@Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ],
    multerConfig,
  ),
)
async addChapter(
  @Param('bookId') bookId: string,
  @UploadedFiles()
  files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  @Body() body: { chapterNumber: number },
) {
  return this.bookService.addChapter(
    +bookId,
    body,
    files.file?.[0],
    files.thumbnail?.[0],
  );
}
//   @Get(':bookId/chapters')
// //  // optional for public access
// async getChapters(@Param('bookId') bookId: string) {
//   return this.bookService.getChaptersByBookId(+bookId);
// }
@Get(':bookId/chapters')
@Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
async getChapters(@Param('bookId') bookId: string) {
  const id = Number(bookId);
  if (isNaN(id)) {
    throw new BadRequestException('Invalid bookId');
  }
  return this.bookService.getChaptersByBookId(id);

}
@Get('proxy/thumbnail')
async proxyThumbnail(@Query('url') url: string, @Res() res: Response) {
  if (!url) throw new BadRequestException('url query param required');
  
  try {
    const response = await fetch(url, {
      headers: url.includes('/remote.php/dav') 
        ? { 
            Authorization: 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64') 
          }
        : {}
    });

    if (!response.ok || !response.body) {
      throw new NotFoundException('Thumbnail not found');
    }

    // Use content-type from response
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    (response.body as NodeJS.ReadableStream).pipe(res);

  } catch (err) {
    console.error('Thumbnail fetch error:', err.message);
    throw new NotFoundException('Thumbnail not found');
  }
}

// @Get('proxy/thumbnails/:bookId/:filename')
// async proxyThumbnail(
//   @Param('bookId') bookId: string,
//   @Param('filename') filename: string,
//   @Res() res: Response,
// ) {
//   if (!process.env.NEXTCLOUD_PASS) {
//     throw new Error('NEXTCLOUD_PASS is not set in .env');
//   }

//   const encodedPass = encodeURIComponent(process.env.NEXTCLOUD_PASS);
//   const authHeader = 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${encodedPass}`).toString('base64');
//   const encodedFilename = encodeURIComponent(filename);

//   const url = `${process.env.NEXTCLOUD_BASE_URL}/remote.php/dav/files/${process.env.NEXTCLOUD_USER}/books/${bookId}/chapters/thumbnails/${encodedFilename}`;
//   console.log('Fetching thumbnail from:', url);

//   try {
//     const response = await fetch(url, {
//       headers: {
//         Authorization: authHeader,
//       },
//     });

//     console.log('Response status:', response.status);

//     if (!response.ok || !response.body) {
//       console.error('Thumbnail not found in Nextcloud');
//       throw new NotFoundException('Thumbnail not found');
//     }

//     res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
//     (response.body as NodeJS.ReadableStream).pipe(res);
//   } catch (err) {
//     console.error('Fetch error:', err);
//     throw new NotFoundException('Thumbnail not found');
//   }
// }







}
