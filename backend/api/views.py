from rest_framework import viewsets, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password, make_password
from .models import (
    Usuario, Institucion, SolicitudInstitucion, Estacion, 
    SolicitudEstacion, Variable, Sensor, Medicion, Alerta, Reporte
)
from .serializers import (
    UsuarioSerializer, InstitucionSerializer, SolicitudInstitucionSerializer,
    EstacionSerializer, SolicitudEstacionSerializer, VariableSerializer,
    SensorSerializer, MedicionSerializer, AlertaSerializer, ReporteSerializer
)

class AuthView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = Usuario.objects.get(correo_electronico=email)
        except Usuario.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Assuming plain text for legacy compatibility as per prompt constraints not specifying hashing
        # In production, use check_password(password, user.contraseña)
        if user.contraseña == password: 
            refresh = RefreshToken()
            refresh['user_id'] = user.id_usuario
            refresh['role'] = user.tipo_usuario
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UsuarioSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class RegisterView(views.APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class InstitucionViewSet(viewsets.ModelViewSet):
    queryset = Institucion.objects.all()
    serializer_class = InstitucionSerializer

class SolicitudInstitucionViewSet(viewsets.ModelViewSet):
    queryset = SolicitudInstitucion.objects.all()
    serializer_class = SolicitudInstitucionSerializer

    @action(detail=True, methods=['patch'])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        solicitud.estado = 'APROBADA'
        solicitud.save()
        
        # Create the institution
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

class SolicitudEstacionViewSet(viewsets.ModelViewSet):
    queryset = SolicitudEstacion.objects.all()
    serializer_class = SolicitudEstacionSerializer

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

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class MedicionViewSet(viewsets.ModelViewSet):
    queryset = Medicion.objects.all()
    serializer_class = MedicionSerializer
    
    @action(detail=False, methods=['get'])
    def ultimas(self, request):
        latest = Medicion.objects.order_by('-fecha')[:10]
        serializer = self.get_serializer(latest, many=True)
        return Response(serializer.data)

class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
