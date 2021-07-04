import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Button, Layout, StyleService, useStyleSheet, Icon } from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';
import { Formik } from 'formik';

import { PersonIcon } from './extra/icons';
import { KeyboardAvoidingView } from './extra/3rd-party';
import { signInWithEmailAndPassword } from '../../firebase/users';
import InputWithError from '../../components/input-and-error';
import userSignInValidationSchema from '../../validations/userSignIn';

export default ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const formInitialValues = {
    email: '',
    password: '',
  }

  const styles = useStyleSheet(themedStyles);

  const onSignInButtonPress = async (data, { resetForm }) => {
    const signInResponse = await signInWithEmailAndPassword({
      email: data.email,
      password: data.password
    });

    if (signInResponse.error) {
      showMessage({
        message: signInResponse.error,
        type: 'error',
        duration: 2000,
      });

      return;
    }

    showMessage({
      message: signInResponse.success,
      type: 'success',
      duration: 2000,
    });

    resetForm({});

    navigation && navigation.navigate('Home');
  };

  const onSignUpButtonPress = () => navigation && navigation.navigate('Cadastro');

  const onForgotPasswordButtonPress = () => navigation && navigation.navigate('ForgotPassword');

  const onPasswordIconPress = () => setPasswordVisible(!passwordVisible);

  const renderPasswordIcon = (props) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Formik initialValues={formInitialValues} validationSchema={userSignInValidationSchema} onSubmit={onSignInButtonPress} >
        {({ values, touched, errors, handleChange, handleSubmit, setFieldTouched }) => (
          <>
            <Layout
              style={styles.formContainer}
              level='1'>
              <InputWithError
                autoCapitalize='none'
                placeholder='Email'
                maxLength={100}
                accessoryRight={PersonIcon}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                flags={{ error: errors?.email, touched: touched?.email }}
              />
              <InputWithError
                style={styles.passwordInput}
                placeholder='Senha'
                maxLength={10}
                accessoryRight={renderPasswordIcon}
                value={values.password}
                secureTextEntry={!passwordVisible}
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password')}
                flags={{ error: errors?.password, touched: touched?.password }}
              />
              <View style={styles.forgotPasswordContainer}>
                <Button
                  style={styles.forgotPasswordButton}
                  appearance='ghost'
                  status='danger'
                  onPress={onForgotPasswordButtonPress}>
                  Esqueceu sua senha?
                </Button>
              </View>
            </Layout>
            <Button
              style={styles.signInButton}
              size='giant'
              onPress={handleSubmit}
            >
              ENTRAR
            </Button>
          </>
        )}
      </Formik>
      <Button
        style={styles.signUpButton}
        appearance='ghost'
        status='basic'
        onPress={onSignUpButtonPress}>
        Não tem uma conta? Criar agora
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: 'color-success-400',
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    backgroundColor: 'color-success-400',
  },
  signInButton: {
    borderRadius: 50,
    marginHorizontal: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
});
