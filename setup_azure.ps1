# Azure Infrastructure Setup Script for Portfolio Analyzer
# Requirements: Azure CLI (az) installed and logged in (az login)

$AZ_PATH = "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"
$SUB_ID = "4813892f-f483-48c1-b422-92502ae76b2f" # Extracted from az account show
$RAND = Get-Random -Minimum 1000 -Maximum 9999
$RES_GROUP = "InvestmentAnalyzerRG" # Final name
$LOCATION = "southeastasia" # Specifically allowed by policy
$STORAGE_ACCOUNT = "portfolioaccount$RAND"
$COSMOS_ACCOUNT = "portfoliocosmos$RAND"
$VISION_ACCOUNT = "portfoliovision$RAND"
$FUNCTION_APP = "portfoliofunction$RAND"
$KEY_VAULT = "portfoliovault$RAND"

Write-Host "--- Starting Azure Resource Provisioning with Subscription: $SUB_ID ---" -ForegroundColor Cyan

# 1. Create Resource Group
Write-Host "Creating Resource Group: $RES_GROUP..."
& $AZ_PATH group create --name $RES_GROUP --location $LOCATION --subscription $SUB_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create Resource Group."; exit }

# 2. Create Storage Account & Container
Write-Host "Creating Storage Account: $STORAGE_ACCOUNT..."
& $AZ_PATH storage account create --name $STORAGE_ACCOUNT --resource-group $RES_GROUP --location $LOCATION --sku Standard_LRS --subscription $SUB_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create Storage Account."; exit }
$CONN_STR = & $AZ_PATH storage account show-connection-string --name $STORAGE_ACCOUNT --resource-group $RES_GROUP --query connectionString -o tsv --subscription $SUB_ID
& $AZ_PATH storage container create --name "screenshots" --connection-string $CONN_STR --subscription $SUB_ID | Out-Null

# 3. Create Azure AI Vision
Write-Host "Creating AI Vision Service: $VISION_ACCOUNT..."
& $AZ_PATH cognitiveservices account create --name $VISION_ACCOUNT --resource-group $RES_GROUP --kind ComputerVision --sku F0 --location $LOCATION --yes --subscription $SUB_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create AI Vision Service."; exit }
$VISION_KEY = & $AZ_PATH cognitiveservices account keys list --name $VISION_ACCOUNT --resource-group $RES_GROUP --query key1 -o tsv --subscription $SUB_ID
$VISION_ENDPOINT = & $AZ_PATH cognitiveservices account show --name $VISION_ACCOUNT --resource-group $RES_GROUP --query properties.endpoint -o tsv --subscription $SUB_ID

# 4. Create Cosmos DB
Write-Host "Creating Cosmos DB Account: $COSMOS_ACCOUNT..."
& $AZ_PATH cosmosdb create --name $COSMOS_ACCOUNT --resource-group $RES_GROUP --locations regionName=$LOCATION failoverPriority=0 isZoneRedundant=False --subscription $SUB_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create Cosmos DB account."; exit }
& $AZ_PATH cosmosdb sql database create --account-name $COSMOS_ACCOUNT --resource-group $RES_GROUP --name "PortfolioDB" --subscription $SUB_ID
& $AZ_PATH cosmosdb sql container create --account-name $COSMOS_ACCOUNT --resource-group $RES_GROUP --database-name "PortfolioDB" --name "Investments" --partition-key-path "/userId" --subscription $SUB_ID

# 5. Create Key Vault
Write-Host "Creating Key Vault: $KEY_VAULT..."
& $AZ_PATH keyvault create --name $KEY_VAULT --resource-group $RES_GROUP --location $LOCATION --subscription $SUB_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create Key Vault."; exit }
& $AZ_PATH keyvault secret set --vault-name $KEY_VAULT --name "VisionKey" --value $VISION_KEY --subscription $SUB_ID | Out-Null

# 6. Create Function App
Write-Host "Creating Function App: $FUNCTION_APP..."
& $AZ_PATH functionapp create --name $FUNCTION_APP --resource-group $RES_GROUP --storage-account $STORAGE_ACCOUNT --consumption-plan-location $LOCATION --runtime "python" --runtime-version "3.11" --functions-version "4" --os-type "Linux" --subscription $SUB_ID | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Failed to create Function App."; exit }

# 7. Configure App Settings
Write-Host "Configuring Function App Settings..."
& $AZ_PATH functionapp config appsettings set --name $FUNCTION_APP --resource-group $RES_GROUP --settings "VISION_ENDPOINT=$VISION_ENDPOINT" "VISION_KEY=$VISION_KEY" "COSMOS_URL=https://$COSMOS_ACCOUNT.documents.azure.com:443/" "COSMOS_KEY=$( & $AZ_PATH cosmosdb keys list --name $COSMOS_ACCOUNT --resource-group $RES_GROUP --query primaryMasterKey -o tsv --subscription $SUB_ID )" --subscription $SUB_ID | Out-Null

Write-Host "--- Infrastructure Ready ---" -ForegroundColor Green
Write-Host "Resource Group: $RES_GROUP"
Write-Host "Storage Account: $STORAGE_ACCOUNT"
Write-Host "Vision Endpoint: $VISION_ENDPOINT"
Write-Host "Key Vault: $KEY_VAULT"
