# flight_data_collect/admin
from django.contrib import admin
from flight_data_collect.models import Telemetry_log, Location_log

admin.site.register(Telemetry_log)
admin.site.register(Location_log)
