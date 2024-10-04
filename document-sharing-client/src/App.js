import React from 'react';
import { Layout } from 'antd';
import UploadForm from './components/UploadForm';

const { Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content">
          <UploadForm />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Document Sharing Service ©2024 Created by Legal Doc Sharing Major Project
      </Footer>
    </Layout>
  );
}

export default App;
