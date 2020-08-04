import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

const exec = require('child_process').exec;
const fs = require('fs');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  index(@Query('source') source: string): any {
    let path = source.substr(0, source.indexOf('.'));
    let name = source.substr(source.lastIndexOf('/') + 1).replace('.mp4', '');
    let tempFile = path + '/.' + name + '.mp4';
    exec('ffmpeg -i ' + source + ' -metadata rotate="" ' + tempFile);
    exec('ffmpeg -i ' + source + ' -codec copy -vbsf h264_mp4toannexb -map 0 -f segment -segment_list ' + path + '/default.m3u8 -segment_time  2 ' + path + '/%03d.ts');
    fs.unlinkSync(tempFile);
    return { status:true };
  }
}
