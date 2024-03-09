import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        console.log('Metadata metatype:', metadata.metatype);
        console.log('Value:', value);
        const obj = plainToInstance(metadata.metatype, value)
        console.log(typeof obj);
       if(typeof obj ==="string") return value
        const errors =  await validate(obj)


        if( errors.length) {
            console.log('errors есть')
            let message = errors.map(err=>{
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`
            })
            throw new ValidationException(message)
        }
        else {
            console.log('валидация успешна')
            return value
        }

    }
}