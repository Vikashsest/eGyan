// import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, BadRequestException, Req, NotFoundException, HttpException, Res, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
// import { BookService } from './book.service';
// import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';
// import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
// import { multerConfig } from 'src/common/utils/multer';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from 'src/common/guard/role.guard';
// import { Roles } from 'src/common/decorators/role.decorator';
// import { User, UserRole } from '../user/entities/user.entity';
// import { Response, Request } from 'express';
// const fetch = require('node-fetch');
// import axios from "axios";
// import { pipeline } from "stream";
// import { promisify } from "util";
// const streamPipeline = promisify(pipeline);
// interface CustomRequest extends Request {
//   user: User;
// }

// @Controller('books')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class BookController {
//   constructor(private readonly bookService: BookService) {}


  

//   @Get('dashboard-stats')
//   @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
//   async getStats() {
//     return this.bookService.getDashboardStats();
//   }

//   @Get('uploaded-by')
//   async uploadedBy(@Req() req: CustomRequest) {
//     const userId = req.user?.id;
//     return this.bookService.findByUploaderId(userId);
//   }

//   @Post('upload')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
//   @UseInterceptors(
//     FileFieldsInterceptor(
//       [
//         { name: 'file', maxCount: 1 },
//         { name: 'thumbnail', maxCount: 1 },
//       ],
//       multerConfig
//     )
//   )
//   async uploadBook(
//     @UploadedFiles()
//     files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
//     @Body() createBookDto: CreateBookDto,
//     @Req() req: CustomRequest
//   ) {
//     const thumbnail = files.thumbnail?.[0];
//     if (thumbnail) {
//       createBookDto.thumbnail = thumbnail.path || `uploads/${thumbnail.filename}`;
//     }
//     const user = req.user!;
//     return this.bookService.createBook(createBookDto, user);
//   }

//   // ----------------- PROXY ROUTES -----------------
//   // @Get('proxy/chapters/:bookId/chapter-:chapterNumber.pdf')
//   // async proxyChapter(
//   //   @Param('bookId') bookId: string,
//   //   @Param('chapterNumber') chapterNumber: string,
//   //   @Req() req: Request,
//   //   @Res() res: Response
//   // ) {
//   //   const url = `https://cloud.ptgn.in/c/remote.php/dav/files/egyan/books/${bookId}/chapters/chapter-${chapterNumber}.pdf`;
//   //   const headers: Record<string, string> = {
//   //     Authorization: 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64'),
//   //   };
//   //   const rangeHeader = req.headers['range'] as string | undefined;
//   //   if (rangeHeader) headers['Range'] = rangeHeader;

//   //   const response = await fetch(url, { headers });
//   //   if (!response.ok || !response.body) throw new NotFoundException('File not found');

//   //   if (response.status === 206 || rangeHeader) {
//   //     res.status(206);
//   //     if (response.headers.get('content-range')) res.setHeader('Content-Range', response.headers.get('content-range'));
//   //   } else res.status(200);

//   //   res.setHeader('Accept-Ranges', 'bytes');
//   //   res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
//   //   if (response.headers.get('content-length')) res.setHeader('Content-Length', response.headers.get('content-length'));

//   //   (response.body as NodeJS.ReadableStream).pipe(res);
//   // }
// @Get('proxy/file')
// async proxyFile(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
//   if (!url) throw new BadRequestException('url query param required');

//   try {
//     console.time(`File Fetch: ${url}`);

//     if (url.includes('/index.php/s/')) {
//       if (!url.endsWith('/download')) url = url.replace(/\/+$/, '') + '/download';
//     }

//     const headers: Record<string, string> = {};
//     const rangeHeader = req.headers['range'] as string | undefined;
//     if (rangeHeader) headers['Range'] = rangeHeader;

//     if (url.includes('/remote.php/dav')) {
//       headers['Authorization'] =
//         'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64');
//     }

//     const response = await axios.get(url, {
//       headers,
//       responseType: 'stream',
//       validateStatus: () => true,
//     });

//     if (response.status >= 400) throw new NotFoundException('File not found');

//     res.status(response.status);
//     Object.entries(response.headers).forEach(([key, value]) => {
//       if (value) res.setHeader(key, value as string);
//     });

//     await streamPipeline(response.data, res);
//     console.timeEnd(`File Fetch: ${url}`);
//   } catch (err) {
//     console.error('Proxy error:', err.message);
//     throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
//   }
// }

// //   @Get('proxy/file')
// // async proxyFile(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
// //   if (!url) throw new BadRequestException('url query param required');

// //   try {
// //    console.time(`Thumbnail Fetch: ${url}`)
// //     if (url.includes('/index.php/s/')) {
// //       if (!url.endsWith('/download')) url = url.replace(/\/+$/, '') + '/download';
// //     }

// //     const headers: Record<string, string> = {};
// //     const rangeHeader = req.headers['range'] as string | undefined;
// //     if (rangeHeader) headers['Range'] = rangeHeader;

// //     if (url.includes('/remote.php/dav')) {
// //       headers['Authorization'] =
// //         'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64');
// //     }

// //     const response = await fetch(url, { headers, redirect: 'follow' });

// //     if (!response.ok || !response.body) throw new NotFoundException('File not found');
// //    console.timeEnd(`Thumbnail Fetch: ${url}`)
// //     res.status(response.status);
// //     res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
// //     if (response.headers.get('content-length')) res.setHeader('Content-Length', response.headers.get('content-length'));
// //     if (response.headers.get('content-range')) res.setHeader('Content-Range', response.headers.get('content-range'));
// //     res.setHeader('Accept-Ranges', 'bytes');

// //     (response.body as NodeJS.ReadableStream).pipe(res);
// //   } catch (err) {
// //     console.error('Proxy error:', err.message);
// //     throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
// //   }
// // }

 
// // @Get('proxy/file')
// // async proxyFile(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
// //   if (!url) throw new BadRequestException('url query param required');

// //   try {
// //     // Transform public share links to direct download
// //     if (url.includes('/index.php/s/')) {
// //       if (!url.endsWith('/download')) url = url.replace(/\/+$/, '') + '/download';
// //     }

// //     // Setup headers
// //     const headers: Record<string, string> = {};
// //     const rangeHeader = req.headers['range'] as string | undefined;
// //     if (rangeHeader) headers['Range'] = rangeHeader;

// //     // Internal DAV URLs need Basic Auth
// //     if (url.includes('/remote.php/dav')) {
// //       headers['Authorization'] =
// //         'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64');
// //     }

// //     // Fetch file from Nextcloud
// //     const response = await fetch(url, { headers, redirect: 'follow' });

// //     // Make sure we got the file
// //     if (!response.ok || !response.body) throw new NotFoundException('File not found');

// //     // Stream file with proper headers
// //     res.status(response.status);
// //     res.setHeader('Content-Type', response.headers.get('content-type') || 'application/pdf');
// //     if (response.headers.get('content-length')) res.setHeader('Content-Length', response.headers.get('content-length'));
// //     if (response.headers.get('content-range')) res.setHeader('Content-Range', response.headers.get('content-range'));
// //     res.setHeader('Accept-Ranges', 'bytes');

// //     (response.body as NodeJS.ReadableStream).pipe(res);
// //   } catch (err) {
// //     console.error('Proxy error:', err.message);
// //     throw new HttpException('Failed to fetch file', HttpStatus.BAD_GATEWAY);
// //   }
// // }


// @Get("proxy/thumbnail")
// async proxyThumbnail(@Query("url") url: string, @Res() res: Response) {
//   if (!url) throw new BadRequestException("url query param required");

//   console.time(`Thumbnail Fetch: ${url}`);
//   try {
//     const headers: Record<string, string> = {};
//     if (url.includes("/remote.php/dav")) {
//       headers["Authorization"] =
//         "Basic " +
//         Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
//     }

//     const response = await axios.get(url, {
//       headers,
//       responseType: "stream",
//       validateStatus: () => true,
//     });

//     if (response.status >= 400) throw new NotFoundException("Thumbnail not found");

//     res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");

//     await streamPipeline(response.data, res);

//     console.timeEnd(`Thumbnail Fetch: ${url}`);
//   } catch (err) {
//     console.error("Thumbnail fetch error:", err.message);
//     throw new NotFoundException("Thumbnail not found");
//   }
// }


// //   @Get('proxy/thumbnail')
// //   async proxyThumbnail(@Query('url') url: string, @Res() res: Response) {
// //     if (!url) throw new BadRequestException('url query param required');
// //  console.time(`Thumbnail Fetch: ${url}`)
// //     try {
// //       const response = await fetch(url, {
// //         headers: url.includes('/remote.php/dav') ? { Authorization: 'Basic ' + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString('base64') } : {},
// //       });
// //       if (!response.ok || !response.body) throw new NotFoundException('Thumbnail not found');
// //    console.timeEnd(`Thumbnail Fetch: ${url}`)
// //       res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      
// //       (response.body as NodeJS.ReadableStream).pipe(res);
// //     } catch (err) {
// //       console.error('Thumbnail fetch error:', err.message);
// //       throw new NotFoundException('Thumbnail not found');
// //     }
// //   }

//   // ----------------- DYNAMIC ROUTES -----------------
//   @Get(":id/chapters/meta")
// async getChaptersMeta(@Param("id") bookId: string) {
//   return this.bookService.getChaptersMeta(+bookId);
// }
//   @Get(':id/chapters')
//   // @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
//   async getChapters(@Param('id') bookId: string) {
//     const id = Number(bookId);
//     if (isNaN(id)) throw new BadRequestException('Invalid bookId');
//     return this.bookService.getChaptersByBookId(id);
//   }

//   @Get(':id')
//   @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
//   async getBookById(@Param('id') id: string) {
//     const book = await this.bookService.findOneById(+id);
//     if (!book) throw new NotFoundException('Book not found');
//     return book;
//   }

// @Post(':id/chapters')
// @UseInterceptors(
//   FileFieldsInterceptor(
//     [
//       { name: 'file', maxCount: 1 },        // PDF
//       { name: 'thumbnail', maxCount: 1 },   // Thumbnail image
//       { name: 'video', maxCount: 1 },       // Optional video
//       { name: 'audio', maxCount: 1 },       // Optional audio
//     ],
//     multerConfig
//   )
// )
// async addChapter(
//   @Param('id') bookId: string,
//   @UploadedFiles()
//   files: {
//     file?: Express.Multer.File[];
//     thumbnail?: Express.Multer.File[];
//     video?: Express.Multer.File[];
//     audio?: Express.Multer.File[];
//   },
//   @Body() body: { chapterNumber: number }
// ) {
//   return this.bookService.addChapter(
//     +bookId,
//     body,
//     files.file?.[0],
//     files.thumbnail?.[0],
//   );
// }


//   @Patch(':id')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
//   @UseInterceptors(FileInterceptor('pdf'))
//   update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() updateBookDto: UpdateBookDto) {
//     return this.bookService.updateBook(+id, updateBookDto, file);
//   }

//   @Delete(':id')
//   @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
//   async deleteBook(@Param('id') id: number) {
//     return this.bookService.remove(id);
//   }
//    @Delete('chapter/:id')
//   async deleteChapter(@Param('id', ParseIntPipe) id: number) {
//     return this.bookService.deleteChapter(id);
//   }



// @Get(":id/chapters/:chapterId/file")
// async getChapterFile(
//   @Param("id") bookId: string,
//   @Param("chapterId") chapterId: string,
//   @Res() res: Response,
//   @Req() req: Request
// ) {
//   const fileUrl = await this.bookService.getChapterFileStream(+bookId, +chapterId);
//   if (!fileUrl) throw new NotFoundException("File not found");

//   const headers: Record<string, string> = {};
//   if (req.headers["range"]) headers["Range"] = req.headers["range"] as string;

//   if (fileUrl.includes("/remote.php/dav")) {
//     headers["Authorization"] =
//       "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
//   }

//   console.time(`Fetch+Pipe: ${fileUrl}`);
//   const response = await axios.get(fileUrl, {
//     headers,
//     responseType: "stream",
//     validateStatus: () => true, // allow 200 + 206
//   });

//   res.status(response.status);
//   Object.entries(response.headers).forEach(([key, value]) => {
//     if (value) res.setHeader(key, value as string);
//   });

//   await streamPipeline(response.data, res);
//   console.timeEnd(`Fetch+Pipe: ${fileUrl}`);
// }




// // @Get(":id/chapters/:chapterId/proxy")
// // async proxyChapterFile(
// //   @Param("id") bookId: string,
// //   @Param("chapterId") chapterId: string,
// //   @Res() res: Response,
// //   @Req() req: Request
// // ) {
  
// //   const fileUrl = await this.bookService.getChapterFileStream(+bookId, +chapterId);
// //   if (!fileUrl) throw new NotFoundException("File not found");

// //   const headers: Record<string, string> = {};
// //   if (req.headers["range"]) headers["Range"] = req.headers["range"] as string;

// //   if (fileUrl.includes("/remote.php/dav")) {
// //     headers["Authorization"] =
// //       "Basic " +
// //       Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
// //   }

// //   const response = await axios.get(fileUrl, {
// //     headers,
// //     responseType: "stream",
// //     validateStatus: () => true, // allow 206
// //   });

// //   res.status(response.status);
// //   Object.entries(response.headers).forEach(([key, value]) => {
// //     if (value) res.setHeader(key, value as string);
// //   });

// //   response.data.pipe(res);
// // }


//   // ----------------- FIND ALL (LAST) -----------------
//   @Get()
//   findAll() {
//     return this.bookService.findAll();
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Req,
  NotFoundException,
  HttpException,
  Res,
  HttpStatus,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { multerConfig } from "src/common/utils/multer";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "src/common/guard/role.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { User, UserRole } from "../user/entities/user.entity";
import { Response, Request } from "express";
import axios from "axios";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

interface CustomRequest extends Request {
  user: User;
}

@Controller("books")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // ✅ Dashboard stats
  @Get("dashboard-stats")
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL)
  async getStats() {
    return this.bookService.getDashboardStats();
  }

  // ✅ Uploaded by user
  @Get("uploaded-by")
  async uploadedBy(@Req() req: CustomRequest) {
    const userId = req.user?.id;
    return this.bookService.findByUploaderId(userId);
  }

  // ✅ Upload book
  @Post("upload")
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "file", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
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
    if (files.thumbnail?.[0]) {
      createBookDto.thumbnail = files.thumbnail[0].path || `uploads/${files.thumbnail[0].filename}`;
    }
    return this.bookService.createBook(createBookDto, req.user!);
  }

  // ✅ Proxy file (PDF/Video/Audio)
  @Get("proxy/file")
  async proxyFile(@Query("url") url: string, @Req() req: Request, @Res() res: Response) {
    if (!url) throw new BadRequestException("url query param required");

    try {
      if (url.includes("/index.php/s/") && !url.endsWith("/download")) {
        url = url.replace(/\/+$/, "") + "/download";
      }

      const headers: Record<string, string> = {};
      if (req.headers["range"]) headers["Range"] = req.headers["range"] as string;

      if (url.includes("/remote.php/dav")) {
        headers["Authorization"] =
          "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
      }

      const response = await axios.get(url, { headers, responseType: "stream", validateStatus: () => true });

      if (response.status >= 400) throw new NotFoundException("File not found");

      res.status(response.status);
      Object.entries(response.headers).forEach(([key, value]) => value && res.setHeader(key, value as string));

      await streamPipeline(response.data, res);
    } catch (err) {
      console.error("Proxy error:", err.message);
      throw new HttpException("Failed to fetch file", HttpStatus.BAD_GATEWAY);
    }
  }

  // ✅ Proxy thumbnail
  @Get("proxy/thumbnail")
  async proxyThumbnail(@Query("url") url: string, @Res() res: Response) {
    if (!url) throw new BadRequestException("url query param required");

    try {
      const headers: Record<string, string> = {};
      if (url.includes("/remote.php/dav")) {
        headers["Authorization"] =
          "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
      }

      const response = await axios.get(url, { headers, responseType: "stream", validateStatus: () => true });

      if (response.status >= 400) throw new NotFoundException("Thumbnail not found");

      res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
      await streamPipeline(response.data, res);
    } catch (err) {
      console.error("Thumbnail fetch error:", err.message);
      throw new NotFoundException("Thumbnail not found");
    }
  }

  // ✅ Chapters meta
  @Get(":id/chapters/meta")
  async getChaptersMeta(@Param("id") bookId: string) {
    return this.bookService.getChaptersMeta(+bookId);
  }

  @Get(":id/chapters")
  async getChapters(@Param("id") bookId: string) {
    const id = Number(bookId);
    if (isNaN(id)) throw new BadRequestException("Invalid bookId");
    return this.bookService.getChaptersByBookId(id);
  }

  @Get(":id")
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.PRINCIPAL, UserRole.ADMIN)
  async getBookById(@Param("id") id: string) {
    const book = await this.bookService.findOneById(+id);
    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  // ✅ Add chapter
  @Post(":id/chapters")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "file", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 1 },
        { name: "audio", maxCount: 1 },
      ],
      multerConfig
    )
  )
  async addChapter(
    @Param("id") bookId: string,
    @UploadedFiles() files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() body: { chapterNumber: number }
  ) {
    return this.bookService.addChapter(+bookId, body, files.file?.[0], files.thumbnail?.[0]);
  }

  // ✅ Update book
  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
  @UseInterceptors(FileInterceptor("pdf"))
  update(@Param("id") id: string, @UploadedFile() file: Express.Multer.File, @Body() dto: UpdateBookDto) {
    return this.bookService.updateBook(+id, dto, file);
  }

  // ✅ Delete book & chapter
  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  async deleteBook(@Param("id") id: number) {
    return this.bookService.remove(id);
  }

  @Delete("chapter/:id")
  async deleteChapter(@Param("id", ParseIntPipe) id: number) {
    return this.bookService.deleteChapter(id);
  }

  // ✅ Chapter file stream
  @Get(":id/chapters/:chapterId/file")
  async getChapterFile(@Param("id") bookId: string, @Param("chapterId") chapterId: string, @Res() res: Response, @Req() req: Request) {
    const fileUrl = await this.bookService.getChapterFileStream(+bookId, +chapterId);
    if (!fileUrl) throw new NotFoundException("File not found");

    const headers: Record<string, string> = {};
    if (req.headers["range"]) headers["Range"] = req.headers["range"] as string;

    if (fileUrl.includes("/remote.php/dav")) {
      headers["Authorization"] =
        "Basic " + Buffer.from(`${process.env.NEXTCLOUD_USER}:${process.env.NEXTCLOUD_PASS}`).toString("base64");
    }

    const response = await axios.get(fileUrl, { headers, responseType: "stream", validateStatus: () => true });

    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => value && res.setHeader(key, value as string));

    await streamPipeline(response.data, res);
  }

  // ✅ List all
  @Get()
  findAll() {
    return this.bookService.findAll();
  }
}
