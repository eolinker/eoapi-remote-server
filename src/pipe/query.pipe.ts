import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateQueryPipe implements PipeTransform {
  transform(value: any) {
    let result = {
      uuids: [],
    };
    try {
      result.uuids = JSON.parse(value.uuids);
    } catch (e) {}
    return result;
  }
}
