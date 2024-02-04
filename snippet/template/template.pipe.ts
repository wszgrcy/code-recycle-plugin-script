import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'template',standalone:true })
export class TemplateClass implements PipeTransform {
  transform(value: any): any {}
}
