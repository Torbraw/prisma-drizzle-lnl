import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema, ValiError, parse } from 'valibot';

export class ValibotValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(private schema: ObjectSchema<any, any>) {}

  public transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      const parsedValue = parse(this.schema, value, { abortEarly: true });
      return parsedValue;
    } catch (error) {
      if (error instanceof ValiError) {
        // With abortEarly: true, there will only be one issue.
        const message = `${error.issues[0].path?.map((item) => item.key).join('.') ?? ''}: ${error.issues[0].message}`;
        throw new BadRequestException(message);
      } else {
        throw new BadRequestException('Validation failed.');
      }
    }
  }
}
