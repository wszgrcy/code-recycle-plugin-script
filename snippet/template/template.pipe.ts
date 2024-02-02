import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'template' })
export class TemplateClass implements PipeTransform {
  transform(value: any): any {}
}
