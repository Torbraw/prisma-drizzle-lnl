import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema, ValiError, flatten, parse } from 'valibot';

export class ValibotValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(private schema: ObjectSchema<any, any>) {}

  public transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = parse(this.schema, value, { abortEarly: true });
      return parsedValue;
    } catch (error) {
      if (error instanceof ValiError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new BadRequestException(flatten(error.issues));
      } else {
        throw new BadRequestException('Validation failed.');
      }
    }
  }
}
