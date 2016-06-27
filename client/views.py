#!/usr/bin/python
#-*- coding: utf-8 -*-

import simplejson as json

from django.conf import settings
from django.core.urlresolvers import reverse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.template import Context, loader, RequestContext
from django.shortcuts import render


@csrf_exempt
def home(request, template_name='index.html'):
    print request.POST.get('method')
    print request.POST.get('url')
    print request.POST.get('headers')
    return render(request, template_name)