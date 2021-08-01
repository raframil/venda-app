import React, { useRef } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Spinner,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from '@ui-kitten/components';
import { showMessage } from "react-native-flash-message";
import { Formik } from 'formik';

import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { MenuIcon } from '../../components/icons';
import { KeyboardAvoidingView } from '../../components/keyboard-view';
import InputWithError from '../../components/input-and-error';
import {CubeIconOutline,FileTextIconOutline} from './extra/icons';
import { maskCurrency } from '../../utils/mask';

import ProductValidationSchema from '../../validations/Product';
import { getCurrentUserDocument, updateCurrentUserDocument } from '../../firebase/users';
import { updatePassword } from '../../firebase/auth';

export default ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = React.useState(false);
  const [loadingCep, setLoadingCep] = React.useState(false);
  const [confirmPasswordModalVisible, setConfirmPasswordModalVisible] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');

  const formikRef = useRef();
  const formInitialValues = {
    name: '',
    description: '',
    price: '',
  };

  navigation.addListener('focus', async () => {
    const getCurrentUserDocumentResponse = await getCurrentUserDocument();

    if (!getCurrentUserDocument.error) {
      formikRef.current?.setValues(getCurrentUserDocumentResponse);
    } else {
      showMessage({
        message: 'Ops...',
        description: getCurrentUserDocumentResponse.error,
        type: 'danger',
        duration: 2000,
        floating: true
      });
    }
  });

  const createProduct = async () => {
    // const userFields = JSON.parse(JSON.stringify(formikRef.current?.values));

    showMessage({
      message: updateCurrentUserDocumentResponse.success,
      type: 'success',
      duration: 2000,
      floating: true
    });
    // const updateCurrentUserDocumentResponse = await updateCurrentUserDocument({ userFields });

    // if (updateCurrentUserDocumentResponse.success) {
    //   showMessage({
    //     message: updateCurrentUserDocumentResponse.success,
    //     type: 'success',
    //     duration: 2000,
    //     floating: true
    //   });

    //   formikRef.current?.setFieldValue('password', '');
    // } else if (updateCurrentUserDocumentResponse.error) {
    //   showMessage({
    //     message: 'Ops...',
    //     description: updateCurrentUserDocumentResponse.error,
    //     type: 'danger',
    //     duration: 2000,
    //     floating: true
    //   });
    // };
  };

  const confirmPasswordModal = async () => {
    const updatePasswordResponse = await updatePassword({
      credentials: {
        oldPassword: oldPassword,
        password: formikRef.current?.values.password,
        email: formikRef.current?.values.email,
      }
    });

    if (updatePasswordResponse?.error) {
      showMessage({
        message: 'Ops...',
        description: updatePasswordResponse.error,
        type: 'danger',
        duration: 2000,
        floating: true
      });

      return;
    }
    toggleModalVisibility();

    await createProduct();
  };

  const handleProfileSubmit = () => {
      createProduct();
    
  };

  const styles = useStyleSheet(themedStyles);

  const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' />
    </View>
  );

  const onPasswordIconPress = () => setPasswordVisible(!passwordVisible);
  const onOldPasswordIconPress = () => setOldPasswordVisible(!oldPasswordVisible);
  const toggleModalVisibility = () => setConfirmPasswordModalVisible(!confirmPasswordModalVisible);

  const renderPasswordIcon = (props, passwordStateWatch, passwordIconPress) => (
    <TouchableWithoutFeedback onPress={passwordIconPress}>
      <Icon {...props} name={passwordStateWatch ? 'eye-off-outline' : 'eye-outline'} />
    </TouchableWithoutFeedback>
  );

  const renderDrawerAction = () => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={navigation.toggleDrawer}
    />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='Venda Livre'
        accessoryLeft={renderDrawerAction}
      />
      <Divider />

      <KeyboardAvoidingView style={styles.container}>
        <Formik
          innerRef={formikRef}
          initialValues={formInitialValues}
          validationSchema={ProductValidationSchema}
          onSubmit={handleProfileSubmit}
        >
          {({ values, handleChange, handleSubmit, setFieldTouched, setFieldValue, isValid, touched, errors }) => (
            <>
              <Layout style={styles.formContainer} level='1'>
                <InputWithError
                  autoCapitalize='words'
                  maxLength={100}
                  placeholder='Nome do Produto'
                  accessoryRight={CubeIconOutline}
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                  flags={{ error: errors?.name, touched: touched?.name }}
                />
                <InputWithError
                  autoCapitalize='words'
                  maxLength={500}
                  placeholder='Descrição do Produto'
                  multiline={true}
                  accessoryRight={FileTextIconOutline}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={() => setFieldTouched('description')}
                  flags={{ error: errors?.description, touched: touched?.description }}
                />
                <InputWithError
                  keyboardType='numeric'
                  placeholder='Preço'
                  maxLength={15}
                  value={values.price}
                  onChangeText={(rawPrice) => setFieldValue('price', maskCurrency(rawPrice))}
                  onBlur={() => setFieldTouched('price')}
                  flags={{ error: errors?.price, touched: touched?.price }}
                />
                </Layout>
              <Button
                style={styles.editButton}
                size='giant'
                disabled={!isValid}
                onPress={handleSubmit}
              >
                CRIAR PRODUTO
              </Button>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: 'color-success-400',
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: 'color-success-400',
  },
  emailInput: {
    marginTop: 16,
  },
  passwordInput: {
    marginTop: 16,
  },
  phoneInput: {
    marginTop: 16,
  },
  cepInput: {
    marginTop: 16,
  },
  streetAndNumberContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  streetContainer: {
    flex: 3,
    flexDirection: 'column'
  },
  streetInput: {
    marginTop: 16,
  },
  houseNumberContainer: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'column'
  },
  houseNumberInput: {
    marginTop: 16,
  },
  editButton: {
    borderRadius: 50,
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  errorInput: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'color-danger-600',
  }
});
