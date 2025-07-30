#!/bin/bash

# Variables
REGION="us-east-1"
KEY_NAME="ai-toolkit-key"
SECURITY_GROUP_NAME="ai-toolkit-sg"
DB_NAME="aitoolkit"
DB_USERNAME="admin"
DB_PASSWORD="YourSecurePassword123!"

echo "Setting up AWS infrastructure..."

# Create key pair
echo "Creating EC2 key pair..."
aws ec2 create-key-pair --key-name $KEY_NAME --query 'KeyMaterial' --output text > ${KEY_NAME}.pem
chmod 400 ${KEY_NAME}.pem

# Create security group
echo "Creating security group..."
SECURITY_GROUP_ID=$(aws ec2 create-security-group \
  --group-name $SECURITY_GROUP_NAME \
  --description "Security group for AI Developer Toolkit" \
  --query 'GroupId' --output text)

# Add security group rules
aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 8090 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SECURITY_GROUP_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Create RDS subnet group
echo "Creating RDS subnet group..."
aws rds create-db-subnet-group \
  --db-subnet-group-name ai-toolkit-subnet-group \
  --db-subnet-group-description "Subnet group for AI Toolkit RDS" \
  --subnet-ids subnet-12345 subnet-67890  # You'll need to get actual subnet IDs

# Create RDS instance
echo "Creating RDS PostgreSQL instance..."
aws rds create-db-instance \
  --db-instance-identifier ai-toolkit-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username $DB_USERNAME \
  --master-user-password $DB_PASSWORD \
  --allocated-storage 20 \
  --db-name $DB_NAME \
  --vpc-security-group-ids $SECURITY_GROUP_ID

echo "Infrastructure setup initiated. RDS creation will take ~10 minutes."
echo "Security Group ID: $SECURITY_GROUP_ID"
echo "Key file created: ${KEY_NAME}.pem"