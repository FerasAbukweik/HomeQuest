public class EnumUtils
{
    public static Boolean isSelected(int toCheck, long allStates) => (allStates & toCheck) == toCheck;
}