import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import Button from '../../components/ui/button';
import {
  CaptureModeEnum,
  FilterEnum,
  Options,
  PhotoFileFormatEnum,
  PresetEnum,
  getPhotoCaptureBuilder,
  setOptions,
  stopSelfTimer,
} from '@osakila/theta-client-private-react-native';
import { CaptureCommonOptionsEdit } from '../../components/capture/capture-common-options';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { EnumEdit } from '../../components/options';

const PhotoCaptureScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'photoCapture'>
> = ({ navigation }) => {
  const [captureOptions, setCaptureOptions] = React.useState<Options>();
  const [isTaking, setIsTaking] = React.useState(false);

  const onTakePhoto = async () => {
    setIsTaking(true);

    const builder = getPhotoCaptureBuilder();
    captureOptions?.filter && builder.setFilter(captureOptions.filter);
    captureOptions?.fileFormat &&
      builder.setFileFormat(captureOptions.fileFormat as PhotoFileFormatEnum);
    captureOptions?.preset && builder.setPreset(captureOptions.preset);

    captureOptions?.aperture && builder.setAperture(captureOptions.aperture);
    if (captureOptions?.colorTemperature != null) {
      builder.setColorTemperature(captureOptions.colorTemperature);
    }
    captureOptions?.exposureCompensation &&
      builder.setExposureCompensation(captureOptions.exposureCompensation);
    captureOptions?.exposureDelay &&
      builder.setExposureDelay(captureOptions.exposureDelay);
    captureOptions?.exposureProgram &&
      builder.setExposureProgram(captureOptions.exposureProgram);
    captureOptions?.gpsInfo && builder.setGpsInfo(captureOptions.gpsInfo);
    captureOptions?._gpsTagRecording &&
      builder.setGpsTagRecording(captureOptions._gpsTagRecording);
    captureOptions?.iso && builder.setIso(captureOptions.iso);
    captureOptions?.isoAutoHighLimit &&
      builder.setIsoAutoHighLimit(captureOptions.isoAutoHighLimit);
    captureOptions?.whiteBalance &&
      builder.setWhiteBalance(captureOptions.whiteBalance);

    console.log('takePicture options: :' + JSON.stringify(captureOptions));
    console.log('takePicture builder: :' + JSON.stringify(builder));

    try {
      const photoCapture = await builder.build();
      const url = await photoCapture.takePicture();

      setIsTaking(false);

      if (url) {
        Alert.alert('takePicture file url : ', url, [{ text: 'OK' }]);
      } else {
        Alert.alert('takePicture canceled.');
      }
    } catch (error) {
      setIsTaking(false);
      Alert.alert('takePicture error', JSON.stringify(error), [{ text: 'OK' }]);
    }
  };

  const onStopSelfTimer = async () => {
    try {
      await stopSelfTimer();
    } catch (error) {
      Alert.alert('stopSelfTimer error', JSON.stringify(error), [
        { text: 'OK' },
      ]);
    }
  };

  React.useEffect(() => {
    setOptions({ captureMode: CaptureModeEnum.IMAGE }).catch();
  }, []);

  React.useEffect(() => {
    navigation.setOptions({ title: 'Photo Capture' });
  }, [navigation]);

  return (
    <SafeAreaView
      style={styles.safeAreaContainer}
      edges={['left', 'right', 'bottom']}
    >
      <View style={styles.topViewContainer}>
        <View style={styles.bottomViewContainerLayout}>
          <Button
            style={styles.button}
            title="take photo"
            onPress={onTakePhoto}
            disabled={isTaking}
          />
          <Button
            style={styles.button}
            title="stop self timer"
            onPress={onStopSelfTimer}
            disabled={!isTaking}
          />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView>
          <EnumEdit
            title={'filter'}
            option={captureOptions?.filter}
            onChange={(filter) => {
              setCaptureOptions((prevState) => ({
                ...prevState,
                filter,
              }));
            }}
            optionEnum={FilterEnum}
          />
          <EnumEdit
            title={'fileFormat'}
            option={captureOptions?.fileFormat}
            onChange={(fileFormat) => {
              setCaptureOptions((prevState) => ({
                ...prevState,
                fileFormat,
              }));
            }}
            optionEnum={PhotoFileFormatEnum}
          />
          <EnumEdit
            title={'preset'}
            option={captureOptions?.preset}
            onChange={(preset) => {
              setCaptureOptions((prevState) => ({
                ...prevState,
                preset,
              }));
            }}
            optionEnum={PresetEnum}
          />
          <CaptureCommonOptionsEdit
            onChange={(option) => {
              setCaptureOptions(option);
            }}
            options={captureOptions}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PhotoCaptureScreen;
