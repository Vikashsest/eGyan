// import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, BadRequestException, UploadedFiles, Query, Req, NotFoundException, HttpException, Res, HttpStatus } from '@nestjs/common';
// import { BookService } from './book.service';
// import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';
// import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { multerConfig } from 'src/common/utils/multer';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from 'src/common/guard/role.guard';
// import { Roles } from 'src/common/decorators/role.decorator';
// import { User, UserRole } from '../user/entities/user.entity';
// import { Response } from 'express';
// const fetch = require('node-fetch');

// import { Readable } from 'stream';
// interface CustomRequest extends Request {
//   user: User;
// }

// @Controller('books')
//  @UseGuards(JwtAuthGuard, RolesGuard) 
// export class BookController {
//   constructor(private readonly bookService: BookService) {}
// @Post('upload')
// @Roles(UserRole.ADMIN, UserRole.TEACHER,UserRole.PRINCIPAL)
// @UseInterceptors(
//   FileFieldsInterceptor(
//     [
//       { name: 'file', maxCount: 1 },
//       { name: 'thumbnail', maxCount: 1 },
//     ],
//     multerConfig
//   )
// )
// async uploadBook(
//   @UploadedFiles()
//   files: {
//     file?: Express.Multer.File[];
//     thumbnail?: Express.Multer.File[];
//   },
//   @Body() createBookDto: CreateBookDto,
//  @Req() req: CustomRequest
// ) {
//   console.log(req.user)
 
//   const thumbnail = files.thumbnail?.[0];
//   if (thumbnail) {
//     createBookDto.thumbnail = thumbnail.path || `uploads/${thumbnail.filename}`;
//   }
//  const user = req.user!;
//     return this.bookService.createBook(createBookDto, user);
// }


// // @Get('proxy/chapters/:bookId/:chapterNumber.pdf')
// // async proxyChapterFile(
// //   @Param('bookId') bookId: number,
// //   @Param('chapterNumber') chapterNumber: number,
// //   @Res() res: Response,
// // ) {
// //   const { stream, contentType } = await this.bookService.getChapterFileStream(
// //     +bookId,
// //     +chapterNumber,
// //   );

// //   res.setHeader('Content-Type', contentType || 'application/pdf');
// //   stream.pipe(res);
// // }


// @Get()
// findAll(){
//  const books=this.bookService.findAll()
//   return books
// }
// @Get(':bookId/chapters')
// @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
// async getChapters(@Param('bookId') bookId: string) {
//   const id = Number(bookId);
//   if (isNaN(id)) {
//     throw new BadRequestException('Invalid bookId');
//   }
//   return this.bookService.getChaptersByBookId(id);

// }
// @Get('uploaded-by')
// async uploadedBy(@Req() req: CustomRequest) {
//   const userId = req.user?.id;
//   return this.bookService.findByUploaderId(userId);
// }
// @Delete(':id')
// @Roles(UserRole.ADMIN,UserRole.PRINCIPAL,UserRole.TEACHER)
// async deleteBook(@Param('id') id: number) {
//   return await this.bookService.remove(id);
// }
//   @Get('dashboard-stats')
//   @Roles(UserRole.ADMIN,UserRole.PRINCIPAL)
//    async getStats(){
//     return this.bookService.getDashboardStats()
//    }

// @Get(':id')
// @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
// async getBookById(@Param('id') id: string) {
//   const book = await this.bookService.findOneById(+id);
//   if (!book) {
//     throw new NotFoundException('Book not found');
//   }
//   return book;
// }
// @Get('filter')
// // @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL,UserRole.ADMIN)
// getFilteredBooks(@Query() query: any) {
//   return this.bookService.getFilteredBooks(query);
// }

// @Patch(':id')
// @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
// @UseInterceptors(FileInterceptor('pdf'))
// update(
//   @Param('id') id: string,
//   @UploadedFile() file: Express.Multer.File,
//   @Body() updateBookDto: UpdateBookDto,
// ) {
//   return this.bookService.updateBook(+id, updateBookDto, file);
// }

// // @Get()
// // async(){
// //   return this.bookService.findAll()
// // }
// @Post(':bookId/chapters')

// @UseInterceptors(
//   FileFieldsInterceptor(
//     [
//       { name: 'file', maxCount: 1 },
//       { name: 'thumbnail', maxCount: 1 },
//     ],
//     multerConfig,
//   ),
// )
// async addChapter(
//   @Param('bookId') bookId: string,
//   @UploadedFiles()
//   files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
//   @Body() body: { chapterNumber: number },
// ) {
//   return this.bookService.addChapter(
//     +bookId,
//     body,
//     files.file?.[0],
//     files.thumbnail?.[0],
//   );
// }
// //   @Get(':bookId/chapters')
// // //  // optional for public access
// // async getChapters(@Param('bookId') bookId: string) {
// //   return this.bookService.getChaptersByBookId(+bookId);
// // }
// @Get('proxy/file')
// async proxyFile(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
//   if (!url) {
//     throw new BadRequestException('url query param required');
//   }

//   try {
//     const headers: Record<string, string> = {};

//     // Agar user range request bhej raha ho (PDF streaming ke liye)
//     const rangeHeader = req.headers['range'] as string | undefined;
//     if (rangeHeader) {
//       headers['Range'] = rangeHeader;
//     }

//     // Agar DAV (Nextcloud private path) hai to auth header daal do
//     if (url.includes('/remote.php/dav')) {
//       headers['Authorization'] =
//         'Basic ' +
//         Buffer.from(
//           `${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`,
//         ).toString('base64');
//     }

//     const response = await fetch(url, { headers });

//     if (!response.ok || !response.body) {
//       throw new NotFoundException('File not found in Nextcloud');
//     }

//     // Partial content handle
//     if (response.status === 206 || rangeHeader) {
//       res.status(206);
//       if (response.headers.get('content-range')) {
//         res.setHeader('Content-Range', response.headers.get('content-range'));
//       }
//     } else {
//       res.status(200);
//     }

//     res.setHeader('Accept-Ranges', 'bytes');
//     res.setHeader(
//       'Content-Type',
//       response.headers.get('content-type') || 'application/octet-stream',
//     );
//     if (response.headers.get('content-length')) {
//       res.setHeader('Content-Length', response.headers.get('content-length'));
//     }

//     (response.body as NodeJS.ReadableStream).pipe(res);
//   } catch (err) {
//     console.error('Proxy error:', err.message);
//     throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
//   }
// }



// @Get('proxy/thumbnail')
// async proxyThumbnail(@Query('url') url: string, @Res() res: Response) {
//   if (!url) throw new BadRequestException('url query param required');
  
//   try {
//     const response = await fetch(url, {
//       headers: url.includes('/remote.php/dav') 
//         ? { 
//             Authorization: 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64') 
//           }
//         : {}
//     });

//     if (!response.ok || !response.body) {
//       throw new NotFoundException('Thumbnail not found');
//     }

//     // Use content-type from response
//     res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
//     (response.body as NodeJS.ReadableStream).pipe(res);

//   } catch (err) {
//     console.error('Thumbnail fetch error:', err.message);
//     throw new NotFoundException('Thumbnail not found');
//   }
// }

// // @Get('proxy/thumbnails/:bookId/:filename')
// // async proxyThumbnail(
// //   @Param('bookId') bookId: string,
// //   @Param('filename') filename: string,
// //   @Res() res: Response,
// // ) {
// //   if (!process.env.NEXTCLOUD_PASS) {
// //     throw new Error('NEXTCLOUD_PASS is not set in .env');
// //   }

// //   const encodedPass = encodeURIComponent(process.env.NEXTCLOUD_PASS);
// //   const authHeader = 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${encodedPass}`).toString('base64');
// //   const encodedFilename = encodeURIComponent(filename);

// //   const url = `${process.env.NEXTCLOUD_BASE_URL}/remote.php/dav/files/${process.env.NEXTCLOUD_USER}/books/${bookId}/chapters/thumbnails/${encodedFilename}`;
// //   console.log('Fetching thumbnail from:', url);

// //   try {
// //     const response = await fetch(url, {
// //       headers: {
// //         Authorization: authHeader,
// //       },
// //     });

// //     console.log('Response status:', response.status);

// //     if (!response.ok || !response.body) {
// //       console.error('Thumbnail not found in Nextcloud');
// //       throw new NotFoundException('Thumbnail not found');
// //     }

// //     res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
// //     (response.body as NodeJS.ReadableStream).pipe(res);
// //   } catch (err) {
// //     console.error('Fetch error:', err);
// //     throw new NotFoundException('Thumbnail not found');
// //   }
// // }







// }



import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, BadRequestException, Req, NotFoundException, HttpException, Res, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/utils/multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { User, UserRole } from '../user/entities/user.entity';
import { Response, Request } from 'express';
const fetch = require('node-fetch');

interface CustomRequest extends Request {
  user: User;
}

@Controller('books')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // ----------------- FIXED ROUTES -----------------
  @Get('filter')
  getFilteredBooks(@Query() query: any) {
    return this.bookService.getFilteredBooks(query);
  }

  @Get('dashboard-stats')
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  async getStats() {
    return this.bookService.getDashboardStats();
  }

  @Get('uploaded-by')
  async uploadedBy(@Req() req: CustomRequest) {
    const userId = req.user?.id;
    return this.bookService.findByUploaderId(userId);
  }

  @Post('upload')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
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
    files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() createBookDto: CreateBookDto,
    @Req() req: CustomRequest
  ) {
    const thumbnail = files.thumbnail?.[0];
    if (thumbnail) {
      createBookDto.thumbnail = thumbnail.path || `uploads/${thumbnail.filename}`;
    }
    const user = req.user!;
    return this.bookService.createBook(createBookDto, user);
  }

  // ----------------- PROXY ROUTES -----------------
  @Get('proxy/chapters/:bookId/chapter-:chapterNumber.pdf')
  async proxyChapter(
    @Param('bookId') bookId: string,
    @Param('chapterNumber') chapterNumber: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const url = `https://cloud.ptgn.in/c/remote.php/dav/files/egyan/books/${bookId}/chapters/chapter-${chapterNumber}.pdf`;
    const headers: Record<string, string> = {
      Authorization: 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64'),
    };
    const rangeHeader = req.headers['range'] as string | undefined;
    if (rangeHeader) headers['Range'] = rangeHeader;

    const response = await fetch(url, { headers });
    if (!response.ok || !response.body) throw new NotFoundException('File not found');

    if (response.status === 206 || rangeHeader) {
      res.status(206);
      if (response.headers.get('content-range')) res.setHeader('Content-Range', response.headers.get('content-range'));
    } else res.status(200);

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
    if (response.headers.get('content-length')) res.setHeader('Content-Length', response.headers.get('content-length'));

    (response.body as NodeJS.ReadableStream).pipe(res);
  }

  // @Get('proxy/file')
  // async proxyFile(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
  //   if (!url) throw new BadRequestException('url query param required');

  //   try {
  //     const headers: Record<string, string> = {};
  //     const rangeHeader = req.headers['range'] as string | undefined;
  //     if (rangeHeader) headers['Range'] = rangeHeader;
  //     if (url.includes('/remote.php/dav')) {
  //       headers['Authorization'] = 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64');
  //     }

  //     const response = await fetch(url, { headers });
  //     if (!response.ok || !response.body) throw new NotFoundException('File not found');

  //     if (response.status === 206 || rangeHeader) {
  //       res.status(206);
  //       if (response.headers.get('content-range')) res.setHeader('Content-Range', response.headers.get('content-range'));
  //     } else res.status(200);

  //     res.setHeader('Accept-Ranges', 'bytes');
  //     res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
  //     if (response.headers.get('content-length')) res.setHeader('Content-Length', response.headers.get('content-length'));

  //     (response.body as NodeJS.ReadableStream).pipe(res);
  //   } catch (err) {
  //     console.error('Proxy error:', err.message);
  //     throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
  //   }
  // }
 
@Get('proxy/file')
async proxyFile(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
  if (!url) throw new BadRequestException('url query param required');

  try {
    // Transform public share links to direct download
    if (url.includes('/index.php/s/')) {
      if (!url.endsWith('/download')) url = url.replace(/\/+$/, '') + '/download';
    }

    // Setup headers
    const headers: Record<string, string> = {};
    const rangeHeader = req.headers['range'] as string | undefined;
    if (rangeHeader) headers['Range'] = rangeHeader;

    // Internal DAV URLs need Basic Auth
    if (url.includes('/remote.php/dav')) {
      headers['Authorization'] =
        'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64');
    }

    // Fetch file from Nextcloud
    const response = await fetch(url, { headers, redirect: 'follow' });

    // Make sure we got the file
    if (!response.ok || !response.body) throw new NotFoundException('File not found');

    // Stream file with proper headers
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
    if (response.headers.get('content-length')) res.setHeader('Content-Length', response.headers.get('content-length'));
    if (response.headers.get('content-range')) res.setHeader('Content-Range', response.headers.get('content-range'));
    res.setHeader('Accept-Ranges', 'bytes');

    (response.body as NodeJS.ReadableStream).pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
  }
}




  @Get('proxy/thumbnail')
  async proxyThumbnail(@Query('url') url: string, @Res() res: Response) {
    if (!url) throw new BadRequestException('url query param required');

    try {
      const response = await fetch(url, {
        headers: url.includes('/remote.php/dav') ? { Authorization: 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64') } : {},
      });
      if (!response.ok || !response.body) throw new NotFoundException('Thumbnail not found');

      res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      (response.body as NodeJS.ReadableStream).pipe(res);
    } catch (err) {
      console.error('Thumbnail fetch error:', err.message);
      throw new NotFoundException('Thumbnail not found');
    }
  }

  // ----------------- DYNAMIC ROUTES -----------------
  @Get(':id/chapters')
  // @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
  async getChapters(@Param('id') bookId: string) {
    const id = Number(bookId);
    if (isNaN(id)) throw new BadRequestException('Invalid bookId');
    return this.bookService.getChaptersByBookId(id);
  }

  @Get(':id')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
  async getBookById(@Param('id') id: string) {
    const book = await this.bookService.findOneById(+id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Post(':id/chapters')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }], multerConfig))
  async addChapter(
    @Param('id') bookId: string,
    @UploadedFiles() files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() body: { chapterNumber: number },
  ) {
    return this.bookService.addChapter(+bookId, body, files.file?.[0], files.thumbnail?.[0]);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
  @UseInterceptors(FileInterceptor('pdf'))
  update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBook(+id, updateBookDto, file);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  async deleteBook(@Param('id') id: number) {
    return this.bookService.remove(id);
  }
   @Delete('chapter/:id')
  async deleteChapter(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.deleteChapter(id);
  }

  // ----------------- FIND ALL (LAST) -----------------
  @Get()
  findAll() {
    return this.bookService.findAll();
  }
}
