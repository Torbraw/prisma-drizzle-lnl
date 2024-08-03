import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { GenericSchema, ValiError, flatten, parse } from 'valibot';

export class ValibotValidationPipe<T extends GenericSchema> implements PipeTransform {
  public constructor(private readonly schema: T) {}

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
