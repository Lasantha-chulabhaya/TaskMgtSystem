import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import styled from '@emotion/styled';
import { userAPI } from '../services/apiService';

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

const ChangePasswordModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const passwordData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };

      await userAPI.changePassword(passwordData);
      message.success('Password changed successfully!');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        message.error('Invalid old password or request data');
      } else if (error.response?.status === 401) {
        message.error('Session expired. Please login again.');
      } else {
        message.error('Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please enter your new password'));
    }
    if (value.length < 6) {
      return Promise.reject(new Error('Password must be at least 6 characters long'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please confirm your new password'));
    }
    if (value !== form.getFieldValue('newPassword')) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  return (
    <StyledModal
      title={
        <Space>
          <LockOutlined />
          Change Password
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <FormContainer>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[
              { required: true, message: 'Please enter your current password' }
            ]}
          >
            <Input.Password
              placeholder="Enter current password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password
              placeholder="Enter new password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[{ validator: validateConfirmPassword }]}
          >
            <Input.Password
              placeholder="Confirm new password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </ButtonGroup>
          </Form.Item>
        </Form>
      </FormContainer>
    </StyledModal>
  );
};

export default ChangePasswordModal;