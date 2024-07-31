import { LogLevelEnum } from '../common/enums/enums';
import { IReorderService } from '../common/interfaces/interfaces';
import { logger } from '../common/logger/logger';
import { List } from '../data/models/list';

// PATTERN: Proxy
class ReorderServiceProxy implements IReorderService {
  private service: IReorderService;

  public constructor(service: IReorderService) {
    this.service = service;
  }

  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    logger.log(
      `Parameters receives to Reorder List: items: ${JSON.stringify(items)}
      / startIndex: ${startIndex} / endIndex: ${endIndex}`,
      LogLevelEnum.INFO
    );
    return this.service.reorder(items, startIndex, endIndex);
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    logger.log(
      `Parameters receives to Reorder Cards: lists: ${JSON.stringify(lists)}
      / sourceIndex: ${sourceIndex} / destinationIndex: ${destinationIndex}
      / sourceListId: ${sourceListId} / destinationListId: ${destinationListId}`,
      LogLevelEnum.INFO
    );

    return this.service.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }
}

export { ReorderServiceProxy };
