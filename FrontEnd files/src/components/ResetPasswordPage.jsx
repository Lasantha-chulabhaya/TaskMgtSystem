import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { authAPI } from '../services/apiService';

const { Title, Text } = Typography;

const ResetPasswordContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
`;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const StyledTitle = styled(Title)`
  color: #001529 !important;
  margin-bottom: 8px !important;
`;

const Description = styled(Text)`
  color: #666;
  display: block;
  margin-bottom: 20px;
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const SuccessIcon = styled(CheckCircleOutlined)`
  font-size: 48px;
  color: #52c41a;
  margin-bottom: 16px;
`;

const ResetPasswordPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      message.error('Invalid reset link');
      navigate('/login');
      return;
    }

    validateToken();
  }, [token, navigate]);

  const validateToken = async () => {
    try {
      setValidatingToken(true);
      const response = await authAPI.validateResetToken(token);
      
      if (response.data.valid) {
        setTokenValid(true);
      } else {
        message.error('Invalid or expired reset token');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      message.error('Invalid or expired reset token');
      setTimeout(() => navigate('/login'), 3000);
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const resetData = {
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      };

      await authAPI.resetPassword(resetData);
      
      message.success('Password reset successfully!');
      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  if (validatingToken) {
    return (
      <ResetPasswordContainer>
        <StyledCard>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Text>Validating reset token...</Text>
          </div>
        </StyledCard>
      </ResetPasswordContainer>
    );
  }

  if (!tokenValid) {
    return (
      <ResetPasswordContainer>
        <StyledCard>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Text type="danger">Invalid or expired reset token</Text>
            <br />
            <Button type="primary" onClick={handleGoToLogin} style={{ marginTop: '20px' }}>
              Go to Login
            </Button>
          </div>
        </StyledCard>
      </ResetPasswordContainer>
    );
  }

  if (resetSuccess) {
    return (
      <ResetPasswordContainer>
        <StyledCard>
          <SuccessContainer>
            <SuccessIcon />
            <Title level={3} style={{ color: '#52c41a' }}>
              Password Reset Successful!
            </Title>
            <Text>
              Your password has been reset successfully. You will be redirected to the login page in a few seconds.
            </Text>
            <br />
            <Button type="primary" onClick={handleGoToLogin} style={{ marginTop: '20px' }}>
              Go to Login Now
            </Button>
          </SuccessContainer>
        </StyledCard>
      </ResetPasswordContainer>
    );
  }

  return (
    <ResetPasswordContainer>
      <StyledCard>
        <Header>
          <StyledTitle level={2}>Reset Your Password</StyledTitle>
          <Description>
            Enter your new password below. Make sure it's strong and secure.
          </Description>
        </Header>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 6, message: 'Password must be at least 6 characters long' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleGoToLogin} disabled={loading}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={loading}
                size="large"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </StyledCard>
    </ResetPasswordContainer>
  );
};

export default ResetPasswordPage;