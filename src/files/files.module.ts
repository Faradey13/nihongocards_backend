import { Module } from '@nestjs/common';
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  controllers: [FilesController],
  imports: [JwtModule],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
