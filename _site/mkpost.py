#!/usr/bin/python2
# -*- coding: utf-8 -*-

import datetime
import random
import string
import os

d = datetime.date.today()
r = ''.join(random.choice(string.ascii_letters + string.digits) for n in xrange(9))
s = str(d.year)+'-'+str(d.month)+'-'+str(d.day)+'-'+r+'.md'
with open(s,'w') as f:
    f.write('---\nlayout: post\npost: false\ntitle:\n---\n')
os.system('mv '+s+' ./_posts')
os.system('leafpad ./_posts/'+s)
