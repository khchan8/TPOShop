import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ReceiptUploadForm = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      const formData = {
        orderNumber,
        email,
        comments,
        image: base64Image
      };

      try {
        const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (result.success) {
          alert('Receipt uploaded successfully!');
          // Reset form
          setOrderNumber('');
          setEmail('');
          setComments('');
          setFile(null);
        } else {
          alert('Error uploading receipt: ' + result.message);
        }
      } catch (error) {
        alert('Error uploading receipt: ' + error.toString());
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Upload Your Receipt</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">Order Number</label>
            <Input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Receipt Image</label>
            <Input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Additional Comments (Optional)</label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full">Upload Receipt</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReceiptUploadForm;
