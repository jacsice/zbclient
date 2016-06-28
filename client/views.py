#!/usr/bin/python
#-*- coding: utf-8 -*-

import logging
import simplejson as json
import requests

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render


@csrf_exempt
def home(request, template_name='index.html'):

    return render(request, template_name)


@csrf_exempt
def format(request):
    result = {}
    text_type = 'json'
    try:
        method = request.POST.get('method', '')
        url = request.POST.get('url', '')
        headers = request.POST.get('headers', {})

        if headers:
            headers = eval(headers)
        else:
            headers = {}

        if method == 'GET':
            response = requests.get(str(url), headers=headers)
        else:
            response = requests.post(str(url), headers=headers)

        http_code = response.status_code
        if http_code == 200:
            try:
                data = response.json()
            except Exception, e:
                data = response.text
                text_type = 'text'
                logging.error(e)
        else:
            data = response.text
            text_type = 'text'

        result.update({'http_code': http_code, 'result': data, 'text_type': text_type})
    except Exception, e:
        logging.error(e)
        result.update({'http_code': "ERROR", 'result': {}, 'text_type': text_type})
    return HttpResponse(json.dumps(result))