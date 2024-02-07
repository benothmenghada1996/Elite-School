import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter'
})
export class CustomFilterPipe implements PipeTransform {

  transform(objs:any,x:string): any {
    if(x===undefined || x==""){return objs}
    return(objs.filter(obj=>{return obj.name.toLowerCase().includes(x.toLowerCase())}));
  }

}
