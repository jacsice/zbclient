#!/usr/bin/python
# -*- coding: utf-8 -*-

from django.conf.urls import patterns, url

urlpatterns = patterns('client.views',
    url(r'^$', 'home', name='home'),
    url(r'^format/$', 'format', name='format'),
)
