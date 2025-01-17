import { CardType } from '../types/gameType/gameFromServerType';
import { CONSTANTS } from '../constants/Constants';

export function getNameFromCard(card: CardType): string {
  let cardName: string = `${CONSTANTS.cardImageURL}/`;

  cardName += `${card.cardFace.toLowerCase()}_${card.cardSuite}.png`;

  return cardName;
}

// export function matchListener()
