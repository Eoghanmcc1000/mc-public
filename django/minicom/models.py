from django.db import models
from django.utils import timezone

class Message(models.Model):
    sender = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True) # when i create new messages automatically 
    # set timestamp to Right Now

