cd react-base
terraform init
terraform plan
terraform apply -auto-approve
rm .terraform.lock.hcl
terraform init
terraform apply -auto-approve
terraform destroy -auto-approve

cd fast-api-base && terraform init && terraform apply -auto-approve
terraform apply -auto-approve
terraform taint docker_image.fastapi_app
terraform apply -auto-approve
terraform destroy -auto-approve