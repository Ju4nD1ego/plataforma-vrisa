from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    UsuarioViewSet, InstitucionViewSet, SolicitudInstitucionViewSet,
    EstacionViewSet, SolicitudEstacionViewSet, VariableViewSet,
    SensorViewSet, MedicionViewSet, AlertaViewSet, ReporteViewSet,
    AuthView, RegisterView
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'instituciones', InstitucionViewSet)
router.register(r'solicitudes/instituciones', SolicitudInstitucionViewSet)
router.register(r'estaciones', EstacionViewSet)
router.register(r'solicitudes/estaciones', SolicitudEstacionViewSet)
router.register(r'variables', VariableViewSet)
router.register(r'sensores', SensorViewSet)
router.register(r'mediciones', MedicionViewSet)
router.register(r'alertas', AlertaViewSet)
router.register(r'reportes', ReporteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', AuthView.as_view(), name='auth_login'),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
]
