import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectSchema, ValiError, flatten, parse } from 'valibot';

export class ValibotValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(private schema: ObjectSchema<any, any>) {}

  public transform(value: unknown, _metadata: ArgumentMetadata) {
    try {
      // AbortEarly to minimize time spent on validation
      const parsedValue = parse(this.schema, value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ValiError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const flattenIssues = flatten(error.issues);
        const message = flattenIssues.nested
          ? Object.entries(flattenIssues.nested)
              .map(([key, issues]) => {
                return `${key}: ${issues?.map((issue) => issue).join(', ') ?? ''}`;
              })
              .map((m) => m)
              .join('. ')
          : '';
        throw new BadRequestException(message);
      } else {
        throw new BadRequestException('Validation failed.');
      }
    }
  }
}
