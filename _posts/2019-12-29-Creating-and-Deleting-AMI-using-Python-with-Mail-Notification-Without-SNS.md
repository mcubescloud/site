---
title: Mail Notification on Creation and deletion of AMI without SNS using Python
date: 2019-12-29 13:51:00 +0000
description: Using python in lambda , we are going to see how to automate the ami creation and deletion with email notification 
  without using SNS.
tags:
- Python
- Lambda
- AMI
image: "/assets/1_Sa1KcnK8Y65wT7fMsLIXYg.png"

---
We can run Python code in AWS Lambda. Lambda provides runtimes for Python that execute your code to process events and in this post
we are going to see about Sending a notification of AMI creation and deletion via mail and using AWS Lambda without using SNS.

## Requirements:
* AWS Access and Secret key of a user(with respective lambda permissions)
* AWS Lambda
* Add respective creation and deletion tags to the servers, to see the output.

## Topics
* AMI Creation
* AMI Deletion
* Mail Notification without SNS and
* Cronjob using Cloudwatch events


## Python Code
{% highlight Python %}
#script will search for all instances having a tag with "backup" or "ami" on it
#Replace your Region to take ami
#Replace your Retention value 
#Replace your SES credentials
import boto3 
import collections 
import datetime 
import collections 
import datetime 
import smtplib
import sys 
import time
from time import gmtime, strftime
from datetime import date, timedelta

from email.MIMEMultipart import MIMEMultipart  
from email.MIMEBase import MIMEBase  
from email.MIMEText import MIMEText  
from email import Encoders
import os
reg = 'aws-region'
today = datetime.datetime.now().strftime('%m/%d/%Y')
now = datetime.datetime.now().strftime('%H:%M:%S')
amilist = []
deletelist = []
now = []

ec = boto3.client('ec2','aws-region') #mention your region to backup

def sendMail(resultMsg):    
    ses_user = "xxxxxxaccesskeyxxxxxxxxxxxx"
    ses_pwd = "xxxxxxxxsecretkeyxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    fromadd = "from@mailid.com "
    to = "to@mailid.com "


    msg = MIMEMultipart()
    msg['From'] =fromadd
    msg['To'] = to
    msg['Cc'] = cc
    msg['Subject'] = "AMI TESTING SCRIPT- " + reg  +   " region" + " Dated " + today 
    body = resultMsg
    msg.attach(MIMEText(body,'plain'))
       
       
    mailServer = smtplib.SMTP("email-smtp.us-east-1.amazonaws.com", 587)
    mailServer.ehlo()
    mailServer.starttls()
    mailServer.ehlo()
    mailServer.login(ses_user, ses_pwd)
    mailServer.sendmail(fromadd, to, msg.as_string())
    # Should be mailServer.quit(), but that crashes...
    mailServer.close()


def lambda_handler(event, context):
    
    reservations = ec.describe_instances(
        Filters=[
            {'Name': 'tag-key', 'Values': ['backup', 'ami']},
        ]
    ).get(
        'Reservations', []
    )

    instances = sum(
        [
            [i for i in r['Instances']]
            for r in reservations
        ], [])

    print "Found %d instances that need backing up" % len(instances)

    to_tag = collections.defaultdict(list)

    for instance in instances:
        try:
            retention_days = [
                int(t.get('Value')) for t in instance['Tags']
                if t['Key'] == 'Retention'][0]
        except IndexError:
            retention_days = 0 #mention Retention day
            
            create_time = datetime.datetime.now()
            create_fmt = create_time.strftime('%d-%m-%Y')
            create_tm = create_time.strftime('%H.%M.%S')
       
        for name in instance['Tags']:
            Instancename= name['Value']
            key_fil= name['Key']
            if key_fil == 'Name' :
                AMIid = ec.create_image(InstanceId=instance['InstanceId'], Name="Lambda - " + instance['InstanceId'] + "  ("+ Instancename + ")   at " +create_tm+ "  From " + create_fmt, Description="Lambda created AMI of instance " + instance['InstanceId'], NoReboot=True, DryRun=False)
                to_tag[retention_days].append(AMIid['ImageId'])
                
            
                print "Retaining AMI %s of instance %s for %d days" % (
                    AMIid['ImageId'],
                    instance['InstanceId'],
                    retention_days,
                    )
                    
                amilist.append("Retaining AMI %s of instance %s for %d days" % (AMIid['ImageId'],instance['InstanceId'],retention_days))

    for retention_days in to_tag.keys():
        delete_date = datetime.date.today() + datetime.timedelta(days=retention_days)
        delete_fmt = delete_date.strftime('%d-%m-%Y')
        print "Will delete %d AMIs on %s" % (len(to_tag[retention_days]), delete_fmt ) 
        print "Will delte AMIs %s on %s" % (
                    AMIid['ImageId'],
                    delete_fmt
                    )
        deletelist.append("Will delete %d AMIs on %s" % (len(to_tag[retention_days]), delete_fmt))
        ec.create_tags(
            Resources=to_tag[retention_days],
              Tags=[
                {'Key': 'DeleteOn', 'Value': delete_fmt},
                {'Key': 'ami','Value': 'true'}
               
            ]
        )
        totallist= amilist+deletelist
        count_of_instances = len(instances)
        resultMsg ="";
        deleteMsg ="";
        for j in totallist:
            resultMsg=resultMsg+j+ "\n"
            finmessage="Found %d instances that need backing up" % len(instances) + "\n" +resultMsg
        del amilist[:]
        del deletelist[:]
         
        print (finmessage)
    sendMail(finmessage);
 {% endhighlight Python %}
 
## Python Flow
We are importing the Amazon Web Services (AWS) Software Development Kit (SDK) for Python, which allows Python to make use of AWS Services

## Notification
We are starting the script with assinging the Notification via gmail and for this we need a AWS user access and secret keys with respective lambda permission.
And we are injecting the from and to mail id's to receive the email notifications.Initially we are using the email package to read, write, and send simple email messages, 
as well as more complex MIME messages.
> from email.MIMEMultipart import MIMEMultipart  
from email.MIMEBase import MIMEBase  
from email.MIMEText import MIMEText  
from email import Encoders.

## AMI Creation and Deletion
We are creating and deletion the AMI with retention period of time and for eg., If the ami is taken and its retention period is set as 5 days,
while creating itself the ami is said to be de-register or delete after 5days.
> By describing the instances,with repect to the tags,
Filters=[
            {'Name': 'tag-key', 'Values': ['backup', 'ami']},
        ]
    
By using tag, we are labeling instances to be ami taken and delete then we doing print "Found %d instances that need backing up" 
%d denotes to the number of instances where lambda job gonna apply.

To delete the AMI we need Retention period and for the we need create and delete time to be intaken in code, by using below code
we are assinging the creation and deletion time with respect to the retention period. `Deleteon` tag will be added in each AMI and after the retention period with respect to that tag it will be deregistered.

> create_time = datetime.datetime.now() 
            create_fmt = create_time.strftime('%d-%m-%Y')
            create_tm = create_time.strftime('%H.%M.%S')
 delete_date = datetime.date.today() + datetime.timedelta(days=retention_days)
        delete_fmt = delete_date.strftime('%d-%m-%Y') 
   Tags=[
                {'Key': 'DeleteOn', 'Value': delete_fmt},
                {'Key': 'ami','Value': 'true'}
               ]
        
## Cloudwatch Events
![](/assets/cloudwatch-scheduled-event-triggering-lambda.png)
* By Creating the CW rule we are scheduling the job in AWS.

## Output
![](/assets/Capture1.JPG)

> NOTE:
We are using Array concept to store the multiple instance id's and AMI id's and by using for loop we are passing to the body of the mail.

{% highlight Python %}
deletelist.append("Will delete %d AMIs on %s" % (len(to_tag[retention_days]), delete_fmt))
.
.
totallist= amilist+deletelist
        count_of_instances = len(instances)
        resultMsg ="";
        deleteMsg ="";
        for j in totallist:
            resultMsg=resultMsg+j+ "\n"
            finmessage="Found %d instances that need backing up" % len(instances) + "\n" +resultMsg
        del amilist[:]
        del deletelist[:]
         
        #print amiTakenList  
        print (finmessage)
    sendMail(finmessage);
{% endhighlight Python %}    

> Author: Mcubes.
