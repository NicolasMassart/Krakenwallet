import { useNavigation } from '@react-navigation/native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UINetworkFilters } from '@/components/NetworkFilter/types';
import { COLLECTION_ROW_SIZE, NFTCollectionRow } from '@/components/NFTCollectionRow';
import { NftsCollection, useNftsArchivedCollection, useNftsCollections } from '@/realm/nfts';
import { NavigationProps, Routes } from '@/Routes';

import { ArchivedNftsIcon } from './ArchivedNftsIcon';
import { NftListEmptyState } from './NftListEmptyState';

const Separator = () => <View style={styles.divider} />;

const keyExtractor = (item: NftsCollection) => item.id;

const SEPARATOR_SIZE = 6;
const ITEM_HEIGHT = COLLECTION_ROW_SIZE + SEPARATOR_SIZE;

type Props = {
  networkFilter: UINetworkFilters[];
  refreshControl: FlashListProps<NftsCollection>['refreshControl'];
};

export const NftCollectionList = ({ networkFilter, refreshControl }: Props) => {
  const navigation = useNavigation<NavigationProps<'Nfts'>['navigation']>();
  const insets = useSafeAreaInsets();
  const collections = useNftsCollections(networkFilter);
  const archivedCollection = useNftsArchivedCollection(networkFilter);

  const onPressCollection = useCallback(
    (collection: NftsCollection) => {
      navigation.navigate(Routes.NftCollection, { collectionId: collection.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: NftsCollection }) => <NFTCollectionRow collection={item} onPress={onPressCollection} entering={FadeIn} exiting={FadeOut} />,
    [onPressCollection],
  );

  const renderFooter = () =>
    archivedCollection.nfts.length ? (
      <>
        <Separator />
        <NFTCollectionRow
          collection={archivedCollection}
          onPress={onPressCollection}
          imageComponent={<ArchivedNftsIcon />}
          entering={FadeIn}
          exiting={FadeOut}
        />
        <Separator />
      </>
    ) : null;

  return (
    <FlashList
      data={collections}
      refreshControl={refreshControl}
      extraData={archivedCollection}
      estimatedItemSize={ITEM_HEIGHT}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={StyleSheet.flatten([styles.collectionsWrapper, { paddingBottom: insets.bottom }])}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<NftListEmptyState nftList="collections" networkFilter={networkFilter} />}
    />
  );
};

const styles = StyleSheet.create({
  collectionsWrapper: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  divider: {
    height: SEPARATOR_SIZE,
  },
});
