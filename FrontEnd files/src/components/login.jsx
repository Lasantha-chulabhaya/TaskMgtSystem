import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, message, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { authAPI } from '../services/apiService';
import ForgotPasswordModal from './ForgotPasswordModal';

const LoginContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-right:15%;
`;

const StyledForm = styled(Form)`
  max-width: 100%;
`;

const RegisterLinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const RegisterLink = styled(Link)`
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
    color: #40a9ff;
  }
`;

const ForgotPasswordLink = styled.a`
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
    color: #40a9ff;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const MainTitle = styled.h2`
  color: #001529;          
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 114px;
  line-height: 1.2;
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare login data - using email instead of username
      const loginData = {
        email: values.email,
        password: values.password
      };

      // Make API call to login
      const response = await authAPI.login(loginData);

      // Store JWT token in localStorage
      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        message.success('Login successful!');
        
        // Navigate to dashboard or home page
        navigate('/dashboard'); // Update this to your desired route
      }
      
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Login failed');
        console.error('Login error:', error.response.data);
      } else if (error.request) {
        message.error('Unable to connect to server. Please try again.');
        console.error('Network error:', error.request);
      } else {
        message.error('An unexpected error occurred');
        console.error('Error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check all required fields');
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotModal(false);
  };

  return (
    <LoginContainer>
      <MainTitle>
        WELCOME TO TASK MANAGEMENT SYSTEM
      </MainTitle>
      <StyledForm
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <LinkContainer>
            <Checkbox>Remember me</Checkbox>
            <ForgotPasswordLink onClick={() => setShowForgotModal(true)}>
              Forgot Password?
            </ForgotPasswordLink>
          </LinkContainer>
        </Form.Item>

        <Form.Item label={null}>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form.Item>
      </StyledForm>
      
      <RegisterLinkContainer>
        <RegisterLink to="/register">Don't have an account? Register</RegisterLink>
      </RegisterLinkContainer>

      <ForgotPasswordModal
        visible={showForgotModal}
        onCancel={() => setShowForgotModal(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </LoginContainer>
  )
}

export default Login