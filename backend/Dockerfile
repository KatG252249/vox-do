# Official lightweight Python image
FROM python:3.11-slim

#Allow statements and log messages to immediately appear in the Cloud Run logs
ENV PYTHONUNBUFFERED True

# Set the working directory 
WORKDIR /app

# Copy the requirements file and isntall dependencies
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code 
COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080 

#Run the FastAPI server using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "-port", "8080"]