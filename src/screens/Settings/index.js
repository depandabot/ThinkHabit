import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts } from '../../config/styles';
import Header from '../../components/Header';
import Aicon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';
import ImagePicker from 'react-native-image-picker';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'com.ThinkHabit.premium'
  ],
  android: [
    'com.ThinkHabit.premium'
  ]
});

export default class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updateSettings;
    this.state = {
      name: props.name,
      picture: props.picture,
      premium: props.premium,
      products: null,
      rated: props.rated,
      sound: props.sound,
    }
    this.handleContribution = this.handleContribution.bind(this);
    this.handleImageSelection = this.handleImageSelection.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleRating = this.handleRating.bind(this);
    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
  }

  render() {
    const {
      // name,
      navigation,
      // picture,
      // premium,
      // rated,
      // updateSettings,
      // sound,
    } = this.props;
    
    const { 
      name,
      picture,
      premium,
      rated,
      sound,
    } = this.state;

    return (
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header navigation={navigation} title={'Settings'} />
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleImageSelection}
          style={[styles.profileImage, !picture && { borderWidth: 1, borderColor: colors.darkGrey } ]}
        >
          {
            picture ?
            <Image source={{uri: picture}} style={styles.picture} />
            :
            <Aicon name={'user'} style={styles.user} />
          }
        </TouchableOpacity>
        <TextInput
          keyboardType={'default'}
          onChangeText={this.handleNameInput}
          placeholder={'Your name'}
          placeholderTextColor={colors.darkGrey}
          returnKeyType='done'
          selectionColor={'#FF9900'}
          style={styles.input}
          underlineColorAndroid={'#FFFFFF'}
          value={name}
        />
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleContribution}
          style={[styles.setting, styles.firstSetting]}
        >
          <Text style={styles.settingText}>Contribute a think habit</Text>
        </TouchableOpacity>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Notification sound</Text>
          <Switch
            onTintColor={colors.primary}
            onValueChange={this.toggleSound}
            thumbTintColor={colors.grey}
            tintColor={colors.darkGrey}
            value={sound}
          />
        </View>
        <TouchableOpacity
          activeOpacity={.8}
          onPress={this.handleRating}
          style={styles.setting}
        >
          <Text style={styles.settingText}>Give us a quick rating</Text>
          <Aicon name={'heart'} style={[styles.settingIcon, rated && { color: '#A83F39' }]} />
        </TouchableOpacity>
        {
          premium ?
          <View/>
          :
          <View style={styles.upgradeContainer}>
            <View style={styles.perks}>
              <View style={styles.priceContainer}>
                <Text style={[styles.perky, { fontWeight: 'bold' }]}>Upgrade to premium version</Text>
                <Text style={styles.perky}>$0.99</Text>
              </View>
              <Text style={styles.perky}>Unlock bookmarks queue</Text>
              <Text style={styles.perky}>Support developer</Text>
              <Text style={styles.perky}>Voice dictation</Text>
              <Text style={styles.perky}>Remove ads</Text>
            </View>
            <TouchableOpacity
              activeOpacity={.8}
              onPress={this.handleUpgrade}
              style={styles.upgradeButton}
            >
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        }
      </ScrollView>
    )
  }

  async componentDidMount() {
    if (!this.props.premium) {
      try {
        const products = await RNIap.getProducts(itemSkus);
        this.setState({ products });
      } catch(err) {
        console.warn(err); // standardized err.code and err.message available
      }
    }
  }

  componentWillUnmount() {
    if (this.state.products) RNIap.endConnection();
    if (this.updateSettings) {
      this.props.updateSettings(this.state);
    }
  }

  handleImageSelection() {
    const options = {
      title: 'Select Profile Image',
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let uri;
        if (Platform.OS === 'ios') {
          uri = response.uri;
        } else {
          if (!response.path.includes('file://')) {
            uri = `file://${response.path}`;
          } else {
            uri = response.path;
          }
        }
        this.setState({
          picture: uri
        });
        this.updateSettings = true;
      }
    });
  }

  handleNameInput(text) {
    this.setState({ name: text });
    if (!this.updateSettings) this.updateSettings = true;
  }

  handleContribution() {
    Communications.email(['ThinkHabitIdeas@outlook.com'], [''], [''], 'New Think Habit', 'Hello. I have a think habit I want to share with everyone!');
  }

  toggleSound() {
    const { sound } = this.state;
    this.setState({ sound: !sound });
    this.updateSettings = true;
  }

  handleRating() {
    this.setState({ rated: true });
    if (Platform.OS === 'ios') {
      Linking.canOpenURL("itms-apps://itunes.apple.com/us/app/id${com.O2Balloons}?mt=8").then(supported => {
        if (!supported) { 
          // TODO Display a message
          console.log('Can\'t open URL to App Store: ' + '');
        } else {
          return Linking.openURL("itms-apps://itunes.apple.com/us/app/id${com.O2Balloons}?mt=8");
        }
      }).catch(err => console.error('An error occurred opening App Store', err));
    } else {
      // TODO Make sure this works
      Linking.canOpenURL("market://details?id=com.O2Balloons").then(supported => {
        if (!supported) {
          console.log('Can\'t open URL to Google Play: ' + '');
        } else {
          return Linking.openURL("market://details?id=com.O2Balloons");
        }
      }).catch(err => console.error('An error occurred opening Google Play', err));
    }
    this.updateSettings = true;
  }

  handleUpgrade() {
    // TODO Test on both platforms before release
    RNIap.buyProduct('com.ThinkHabit.premium').then(purchase => {
      console.log('Successfully purchased upgrade', purchase);
      this.setState({ premium: true });
      // TODO Thank the user!
    }).catch(err => {
      console.warn('Error making upgrade purchase:', err);
    })
    this.updateSettings = true;
  }
}

import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  firstSetting: {
    borderTopWidth: 1,
    marginTop: '25@vs',
  },
  input: {
    color: colors.darkGrey,
    fontSize: fonts.large,
    marginTop: '15@vs',
    textAlign: 'center',
    width: '80%',
  },
  perks: {
    alignSelf: 'stretch',
    paddingHorizontal: '15@ms',
  },
  perky: {
    fontSize: fonts.medium,
    marginBottom: '5@vs',
  },
  picture: {
    borderRadius: 100,
    height: '75@ms',
    width: '75@ms',
  },
  priceContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    height: '75@ms',
    justifyContent: 'center',
    marginTop: '35@vs',
    overflow: 'hidden',
    width: '75@ms',
  },
  setting: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: colors.grey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '15@ms',
    paddingVertical: '20@vs',
  },
  settingIcon: {
    color: colors.grey,
    fontSize: fonts.xl,
  },
  settingText: {
    color: colors.darkGrey,
    fontSize: fonts.medium,
  },
  upgradeButton: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: '15@ms',
    elevation: 2,
    marginTop: '35@vs',
    paddingHorizontal: '15@ms',
    paddingVertical: '10@ms',
  },
  upgradeContainer: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: '15@ms',
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: fonts.medium,
  },
  user: {
    color: colors.darkGrey,
    fontSize: '40@ms',
  },
});
