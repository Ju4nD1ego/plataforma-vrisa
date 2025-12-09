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

router.register(r'usuario', UsuarioViewSet) 
router.register(r'institucion', InstitucionViewSet)
router.register(r'solicitudinstitucion', SolicitudInstitucionViewSet)
router.register(r'estacion', EstacionViewSet)
router.register(r'solicitudestacion', SolicitudEstacionViewSet)
router.register(r'variable', VariableViewSet)
router.register(r'sensor', SensorViewSet)
router.register(r'mediciones', MedicionViewSet) 
router.register(r'alertas', AlertaViewSet)
router.register(r'reportes', ReporteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),


    path('api/auth/login/', AuthView.as_view(), name='auth_login'),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),

    # Ruta genérica al final
    path('api/', include(router.urls)),
]