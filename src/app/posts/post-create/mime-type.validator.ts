import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();

  const frObs = new Observable<{ [key: string]: any }>((observer: any) => {
    fileReader.addEventListener('load', () => {
      observer.next({ mimeType: fileReader.result });
      observer.complete();
    });
    fileReader.readAsDataURL(file);
  });
  return frObs;
};
