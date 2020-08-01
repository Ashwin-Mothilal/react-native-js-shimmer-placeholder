import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, FlatList, Image} from 'react-native';
// import {ViewPlaceholder} from 'react-native-js-shimmer-placeholder';
import {ViewPlaceholder} from './src/ViewPlaceholder';
import {TextPlaceholder} from './src/TextPlaceholder';

const RandomColors = ['#0c6db2', '#000000', '#CC8019', '#333333', '#aa251d'];

const Images = [
  require('./assets/1.jpg'),
  require('./assets/2.jpg'),
  require('./assets/3.jpg'),
  require('./assets/4.jpg'),
  require('./assets/5.jpg'),
];

const App = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, []);

  const data = [
    {
      id: 1,
      first_name: 'Juliana',
      last_name: 'Tuffin',
      email: 'jtuffin0@pinterest.com',
    },
    {
      id: 2,
      first_name: 'Cecile',
      last_name: 'Dwelly',
      email: 'cdwelly1@intel.com',
    },
    {
      id: 3,
      first_name: 'Merry',
      last_name: 'Polsin',
      email: 'mpolsin2@yahoo.co.jp',
    },
    {
      id: 4,
      first_name: 'Maurizio',
      last_name: 'Breckin',
      email: 'mbreckin3@netvibes.com',
    },
    {
      id: 5,
      first_name: 'Stacie',
      last_name: 'Cronshaw',
      email: 'scronshaw4@infoseek.co.jp',
    },
  ];

  const onAnimationComplete = useCallback(() => {
    console.log('Completed');
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View style={ExampleStyles.itemContainer}>
          <ViewPlaceholder
            show={show}
            width={100}
            gradientContainerStyle={ExampleStyles.gradientContainerStyle}
            canTriggerAnimationCompletion={index === 0}
            containerStyle={!show ? ExampleStyles.imageContainerStyle : {}}
            onAnimationComplete={onAnimationComplete}>
            <Image
              source={Images[index % Images.length]}
              style={ExampleStyles.imageStyle}
            />
          </ViewPlaceholder>
          <View style={ExampleStyles.nameAndEmailContainer}>
            <TextPlaceholder
              show={show}
              textStyle={ExampleStyles.nameText}
              maskStyle={ExampleStyles.maskStyle}
              maskedChildrenStyle={{
                backgroundColor: RandomColors[index % RandomColors.length],
              }}>
              {`${item.first_name} ${item.last_name}`}
            </TextPlaceholder>
            <TextPlaceholder
              show={show}
              maskStyle={ExampleStyles.maskStyle}
              textStyle={ExampleStyles.emailText}>
              {`${item.email}`}
            </TextPlaceholder>
          </View>
        </View>
      );
    },
    [onAnimationComplete, show],
  );

  const renderItemSeparatorComponent = useCallback(() => {
    return <View style={ExampleStyles.separator} />;
  }, []);

  const getKeyExtractor = useCallback((item, index) => index.toString(), []);

  const renderHeaderComponent = useCallback(() => {
    return (
      <TextPlaceholder
        textStyle={ExampleStyles.headerText}
        show={show}
        maskedChildrenStyle={ExampleStyles.headerMasked}>
        Your friends
      </TextPlaceholder>
    );
  }, [show]);

  return (
    <View style={ExampleStyles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        style={ExampleStyles.flatListContainer}
        contentContainerStyle={ExampleStyles.flatListContentContainer}
        keyExtractor={getKeyExtractor}
        ItemSeparatorComponent={renderItemSeparatorComponent}
        ListHeaderComponent={renderHeaderComponent}
        ListHeaderComponentStyle={ExampleStyles.listHeaderStyle}
        bounces={false}
      />
    </View>
  );
};

const ExampleStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
  },
  flatListContainer: {
    width: '100%',
    height: '100%',
    marginVertical: 0,
    flex: 1,
  },
  flatListContentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  separator: {
    height: 25,
    backgroundColor: 'transparent',
  },
  itemContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#fcfcfc',
    borderRadius: 10,
    shadowOpacity: 1,
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    height: '100%',
    width: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: 'white',
  },
  imageContainerStyle: {
    shadowOpacity: 0.5,
    shadowColor: 'lightgrey',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 5,
    elevation: 5,
  },
  gradientContainerStyle: {
    borderRadius: 100,
  },
  nameAndEmailContainer: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  nameText: {
    marginStart: 10,
    fontWeight: 'bold',
  },
  emailText: {
    marginStart: 10,
    marginTop: 10,
  },
  maskStyle: {
    height: 30,
    flex: 0,
  },
  nameTextMaskedChildrenStyle: {
    backgroundColor: '#0c6db2',
  },
  listHeaderStyle: {
    backgroundColor: 'white',
    height: 50,
    width: '100%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerMasked: {
    backgroundColor: '#3a4449',
  },
});

export default App;
