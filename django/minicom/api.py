import json
from minicom.models import Message
from django.http import HttpResponse

def render_to_json(content, **kwargs):
  return HttpResponse(json.dumps(content), content_type='application/json', **kwargs)


def create_message(request):
  
  print("DEBUG: request.POST =", request.POST)

  # 1. Extract data safely
  sender = request.POST.get('sender')
  content = request.POST.get('content')
  # 2. check if data exists
  if sender and content:
    print(f"DEBUG: Creating message from {sender}")
    Message.objects.create(sender=sender, content=content)
    print("DEBUG: Message created and saved.")
  else:
    print("DEBUG: No data provided, skipping save")
  return render_to_json({'success': True})

def get_messages(request):
  # Get all messages from the database
  messages = Message.objects.all()

  # 2. Convert to a list of dictionaries
  messages_list = []
  for msg in messages:
      messages_list.append({
          'id': msg.id,
          'sender': msg.sender,
          'content': msg.content,
          'timestamp': str(msg.timestamp)
      })

  # Return as JSON
  return render_to_json({'messages': messages_list})

  




