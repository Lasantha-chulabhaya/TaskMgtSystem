import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { authAPI } from '../services/apiService';

const RegisterContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-right:15%;
`;

const StyledForm = styled(Form)`
  max-width: 100%;
`;

const LoginLinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const LoginLink = styled(Link)`
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
    color: #40a9ff;
  }
`;

const MainTitle = styled.h2`
  color: #001529;          
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 114px;
  line-height: 1.2;
`;

const register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Fix: Send email instead of username, and add created_at timestamp
      const registerData = {
        name: values.name,
        email: values.email, // Changed from username to email
        password: values.password,
        created_at: new Date().toISOString() // Add timestamp
      };

      // Make API call to your Spring Boot backend
      const response = await authAPI.register(registerData);

      // Handle successful registration
      message.success('Registration successful! You can now login.');
      console.log('Registration successful:', response.data);
      
      // Redirect to login page after successful registration
      navigate('/login');
      
    } catch (error) {
      // Handle registration errors
      if (error.response) {
        // Server responded with an error
        message.error(error.response.data || 'Registration failed');
        console.error('Registration error:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        message.error('Unable to connect to server. Please try again.');
        console.error('Network error:', error.request);
      } else {
        // Something else happened
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

  return (
    <RegisterContainer>
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
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your full Name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            disabled={loading}
          > 
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form.Item>
      </StyledForm>
      
      <LoginLinkContainer>
        <LoginLink to="/login">Already have an account? Login</LoginLink>
      </LoginLinkContainer>
    </RegisterContainer>
  )
}

export default register