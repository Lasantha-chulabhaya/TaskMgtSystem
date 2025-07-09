import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space, Typography } from 'antd';
import { MailOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { authAPI } from '../services/apiService';

const { Text } = Typography;

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .ant-modal-title {
    color: #001529;
    font-weight: 600;
  }
`;

const FormContainer = styled.div`
  padding: 20px 0;
`;

const ButtonGroup = styled(Space)`
  width: 100%;
  justify-content: flex-end;
`;

const InfoText = styled(Text)`
  color: #666;
  display: block;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const ForgotPasswordModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(values.email);
      message.success({
        content: 'Password reset email sent successfully! Please check your inbox.',
        duration: 5,
      });
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Error sending password reset email:', error);
      
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else if (error.response?.status === 400) {
        message.error('User not found with this email address');
      } else {
        message.error('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <StyledModal
      title={
        <Space>
          <QuestionCircleOutlined />
          Forgot Password
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <FormContainer>
        <InfoText>
          Enter your email address and we'll send you a link to reset your password.
          The link will expire in 15 minutes for security reasons.
        </InfoText>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email address"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <ButtonGroup>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={loading}
                size="large"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </Button>
            </ButtonGroup>
          </Form.Item>
        </Form>
      </FormContainer>
    </StyledModal>
  );
};

export default ForgotPasswordModal;