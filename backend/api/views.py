from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
# Importante: Importamos esto para evitar el 401
from rest_framework.authentication import BasicAuthentication 

from .models import (
    Usuario, Institucion, SolicitudInstitucion, Estacion, 
    SolicitudEstacion, Variable, Sensor, Medicion, Alerta, Reporte
)
from .serializers import (
    UsuarioSerializer, InstitucionSerializer, SolicitudInstitucionSerializer,
    EstacionSerializer, SolicitudEstacionSerializer, VariableSerializer,
    SensorSerializer, MedicionSerializer, AlertaSerializer, ReporteSerializer
)

# --- AUTENTICACIÓN ---
class AuthView(views.APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] # No pedir token para loguearse

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = Usuario.objects.get(correo_electronico=email)
        except Usuario.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if user.contraseña == password: 
            refresh = RefreshToken()
            # OJO: Aquí estamos metiendo tu ID personalizado
            refresh['user_id'] = user.id_usuario
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UsuarioSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(views.APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UsuarioSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- VIEWSETS (MODIFICADOS PARA EVITAR 401) ---
# Agregamos permission_classes y authentication_classes = [] a todos
# para que no choquen con la tabla de usuarios por defecto.

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    authentication_classes = [] 

class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class SolicitudInstitucionViewSet(viewsets.ModelViewSet):
    queryset = SolicitudInstitucion.objects.all()
    serializer_class = SolicitudInstitucionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    @action(detail=True, methods=['patch'])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        solicitud.estado = 'APROBADA'
        solicitud.save()
        Institucion.objects.create(
            nombre=solicitud.nombre,
            logo=solicitud.logo,
            direccion=solicitud.direccion,
            id_usuario=solicitud.id_usuario,
            estado='ACTIVA'
        )
        return Response({'status': 'approved'})

class EstacionViewSet(viewsets.ModelViewSet):
    queryset = Estacion.objects.all()
    serializer_class = EstacionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class SolicitudEstacionViewSet(viewsets.ModelViewSet):
    queryset = SolicitudEstacion.objects.all()
    serializer_class = SolicitudEstacionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    @action(detail=True, methods=['patch'])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        solicitud.estado = 'APROBADA'
        solicitud.save()
        Estacion.objects.create(
            nombre=solicitud.nombre,
            longitud=solicitud.longitud,
            latitud=solicitud.latitud,
            certificado=solicitud.certificado,
            id_usuario=solicitud.id_usuario,
            id_institucion=solicitud.id_institucion,
            estado='ACTIVA'
        )
        return Response({'status': 'approved'})

class VariableViewSet(viewsets.ModelViewSet):
    queryset = Variable.objects.all()
    serializer_class = VariableSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

# --- AQUÍ ESTÁ EL REQUERIMIENTO DE FILTRADO ---
class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def get_queryset(self):
        # Empezamos con todas las mediciones ordenadas
        queryset = Medicion.objects.all().order_by('-fecha')
        
        # 1. Filtrar por Estación
        estacion_id = self.request.query_params.get('estacion')
        if estacion_id:
            queryset = queryset.filter(id_sensor__id_estacion=estacion_id)

        # 2. Filtrar por Rango de Fechas (Requerimiento de Entrega)
        fecha_inicio = self.request.query_params.get('fecha_inicio')
        fecha_fin = self.request.query_params.get('fecha_fin')

        if fecha_inicio and fecha_fin:
            # Asumimos que viene en formato YYYY-MM-DD
            queryset = queryset.filter(fecha__date__range=[fecha_inicio, fecha_fin])
        
        return queryset

    @action(detail=False, methods=['get'])
    def ultimas(self, request):
        latest = Medicion.objects.order_by('-fecha')[:10]
        serializer = self.get_serializer(latest, many=True)
        return Response(serializer.data)

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [AllowAny]
    authentication_classes = []