import { addSeconds, formatDistanceStrict } from 'date-fns';

import { WalletType } from '@/onChain/wallets/registry';

import { getDateLocale } from '/loc/date';

const timePerBlockInSecondsMap: Partial<Record<WalletType, number>> = {
  ethereum: 12,
  polygon: 12,
  arbitrum: 0.25,
  optimism: 2,
  HDsegwitBech32: 10 * 60,
};

export const getTimeEstimate = (type: WalletType, estimatedTimeBlocks: number) => {
  const timePerBlockInSeconds = timePerBlockInSecondsMap[type];

  if (timePerBlockInSeconds && estimatedTimeBlocks) {
    const now = Date.now();
    return formatDistanceStrict(addSeconds(now, estimatedTimeBlocks * timePerBlockInSeconds), now, {
      locale: getDateLocale(),
    });
  }
};
